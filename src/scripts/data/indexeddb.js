import { openDB } from "idb";
import { addFinishedBook } from "./api";

const DATABASE_NAME = "book-finder-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_BOOK_PROGRESS = "book_progress";
const OBJECT_STORE_DAILY_READING_LOG = "daily_reading_log";

let db;

export async function initDb() {
  db = await openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(OBJECT_STORE_BOOK_PROGRESS)) {
        const bookProgressStore = db.createObjectStore(
          OBJECT_STORE_BOOK_PROGRESS,
          { keyPath: ["id_pengguna", "id_buku"] }
        );
        bookProgressStore.createIndex("id_pengguna", "id_pengguna", {
          unique: false,
        });
        bookProgressStore.createIndex("id_buku", "id_buku", { unique: false });
        bookProgressStore.createIndex("status", "status", { unique: false });
      }
      if (!db.objectStoreNames.contains(OBJECT_STORE_DAILY_READING_LOG)) {
        const dailyReadingLogStore = db.createObjectStore(
          OBJECT_STORE_DAILY_READING_LOG,
          { keyPath: "id", autoIncrement: true }
        );
        dailyReadingLogStore.createIndex(
          "id_pengguna_tanggal",
          ["id_pengguna", "tanggal"],
          { unique: true }
        );
        dailyReadingLogStore.createIndex("id_pengguna", "id_pengguna", {
          unique: false,
        });
        dailyReadingLogStore.createIndex("tanggal", "tanggal", {
          unique: false,
        });
      }
    },
  });
  console.log("IndexedDB initialized.");
}

export const BookProgressDB = {
  async addOrUpdateBookProgress(data) {
    if (!db) await initDb();
    const tx = db.transaction(OBJECT_STORE_BOOK_PROGRESS, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_BOOK_PROGRESS);

    // ambil data yang sudah ada
    let existingData = await store.get([data.id_pengguna, data.id_buku]);

    // simpan status lama untuk perubahan
    const oldStatus = existingData ? existingData.status : null;

    let currentBookProgress = {
      id_pengguna: data.id_pengguna,
      id_buku: data.id_buku,
      judul_buku: data.judul_buku || "",
      total_halaman: data.total_halaman || 0,
      halaman_saat_ini: data.halaman_saat_ini || 0,
      persentase_progress: data.persentase_progress || 0,
      status: data.status || "not_started",
      tanggal_mulai:
        data.tanggal_mulai || new Date().toISOString().split("T")[0],
      tanggal_selesai: data.tanggal_selesai || null,
    };

    if (existingData) {
      Object.assign(currentBookProgress, existingData, data);
    } else {
      Object.assign(currentBookProgress, data);
    }

    // PENENTUAN STATUS 'FINISHED'
    const isFinishedNow =
      currentBookProgress.halaman_saat_ini ===
        currentBookProgress.total_halaman &&
      currentBookProgress.total_halaman > 0;

    if (isFinishedNow) {
      currentBookProgress.status = "finished";
      if (!currentBookProgress.tanggal_selesai) {
        currentBookProgress.tanggal_selesai = new Date()
          .toISOString()
          .split("T")[0];
      }
    } else if (currentBookProgress.status !== "finished") {
      currentBookProgress.status = "reading";
    }
    // END

    await store.put(currentBookProgress);
    await tx.done;
    console.log(
      "Book progress added/updated (IndexedDB):",
      currentBookProgress
    );

    // MENGIRIM KE DB
    if (isFinishedNow && oldStatus !== "finished") {
      console.log("Book finished! Sending to DB...");
      const finishedBookData = {
        user_id: currentBookProgress.id_pengguna,
        book_id: currentBookProgress.id_buku,
        finished_at:
          currentBookProgress.tanggal_selesai ||
          new Date().toISOString().split("T")[0],
      };
      try {
        const response = await addFinishedBook(finishedBookData);
        if (response.ok) {
          console.log(
            "Book successfully added to DB finished_books table.",
            response
          );
        } else {
          console.error(
            "Failed to add book to DB finished_books table:",
            response.message
          );
        }
      } catch (error) {
        console.error("Error during API call to add finished book:", error);
      }
    }
    // END KIRIM KE DB
  },

  async getBookProgress(userId, bookId) {
    if (!db) await initDb();
    return db
      .transaction(OBJECT_STORE_BOOK_PROGRESS, "readonly")
      .objectStore(OBJECT_STORE_BOOK_PROGRESS)
      .get([userId, bookId]);
  },

  async getAllUserBookProgress(userId) {
    if (!db) await initDb();
    const tx = db.transaction(OBJECT_STORE_BOOK_PROGRESS, "readonly");
    const store = tx.objectStore(OBJECT_STORE_BOOK_PROGRESS);
    const index = store.index("id_pengguna");
    return index.getAll(userId);
  },

  async addOrUpdateDailyReadingLog(userId, date, pagesRead) {
    if (!db) await initDb();
    const tx = db.transaction(OBJECT_STORE_DAILY_READING_LOG, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_DAILY_READING_LOG);

    const keyRange = IDBKeyRange.only([userId, date]);
    const existingLogs = await store
      .index("id_pengguna_tanggal")
      .getAll(keyRange);

    let existingLog = existingLogs[0];

    if (existingLog) {
      existingLog.halaman_dibaca_pada_tanggal_ini += pagesRead;
      await store.put(existingLog);
    } else {
      await store.add({
        id_pengguna: userId,
        tanggal: date,
        halaman_dibaca_pada_tanggal_ini: pagesRead,
      });
    }
    await tx.done;
    console.log("Daily reading log updated:", { userId, date, pagesRead });
  },

  async getDailyReadingLogs(userId, start_date = null, end_date = null) {
    if (!db) await initDb();
    const tx = db.transaction(OBJECT_STORE_DAILY_READING_LOG, "readonly");
    const store = tx.objectStore(OBJECT_STORE_DAILY_READING_LOG);
    const index = store.index("id_pengguna_tanggal");

    if (start_date && end_date) {
      const keyRange = IDBKeyRange.bound(
        [userId, start_date],
        [userId, end_date]
      );
      return index.getAll(keyRange);
    } else {
      const keyRange = IDBKeyRange.lowerBound([userId, ""]);
      return index.getAll(keyRange);
    }
  },
};
