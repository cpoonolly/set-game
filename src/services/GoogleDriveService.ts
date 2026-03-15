const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const FILE_NAME = "setgame_data.json";

async function searchFiles(token: string): Promise<string | null> {
  const query = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`);
  const res = await fetch(
    `${DRIVE_API}/files?spaces=appDataFolder&q=${query}&fields=files(id)`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to search Drive files");
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

async function createFile(token: string, content: string): Promise<void> {
  const metadata = { name: FILE_NAME, parents: ["appDataFolder"] };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", new Blob([content], { type: "application/json" }));

  const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error("Failed to create Drive file");
}

async function updateFile(token: string, fileId: string, content: string): Promise<void> {
  const res = await fetch(`${UPLOAD_API}/files/${fileId}?uploadType=media`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: content,
  });
  if (!res.ok) throw new Error("Failed to update Drive file");
}

async function downloadFile(token: string, fileId: string): Promise<string> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to download Drive file");
  return res.text();
}

export const GoogleDriveService = {
  async saveAllGamesToDrive(token: string): Promise<void> {
    const games: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("setgame_")) {
        const value = localStorage.getItem(key);
        if (value) games[key] = JSON.parse(value);
      }
    }

    if (Object.keys(games).length === 0) {
      throw new Error("NO_GAMES");
    }

    const content = JSON.stringify(games);
    const fileId = await searchFiles(token);
    if (fileId) {
      await updateFile(token, fileId, content);
    } else {
      await createFile(token, content);
    }
  },

  async loadAllGamesFromDrive(token: string): Promise<void> {
    const fileId = await searchFiles(token);
    if (!fileId) {
      throw new Error("NO_DRIVE_DATA");
    }

    const content = await downloadFile(token, fileId);
    const games: Record<string, unknown> = JSON.parse(content);

    for (const [key, value] of Object.entries(games)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
};
