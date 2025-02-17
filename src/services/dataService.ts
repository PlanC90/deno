import toast from 'react-hot-toast';

const REMOTE_DATA_URL = "https://memex.planc.space/data/";

export async function readJsonFile<T>(filename: string): Promise<T | null> {
  try {
    const response = await fetch(REMOTE_DATA_URL + filename, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
    if (!response.ok) {
      console.error(`Failed to read ${filename}: ${response.status} ${response.statusText}`);
      toast.error(`Failed to read data from ${filename}: ${response.status} ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    toast.error(`Failed to read data from ${filename}: ${error}`);
    return null;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<boolean> {
  try {
    const response = await fetch(REMOTE_DATA_URL + filename, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data, null, 2),
    });

    if (!response.ok) {
      console.error(`Failed to write ${filename}: ${response.status} ${response.statusText}`);
      toast.error(`Failed to save data to ${filename}: ${response.status} ${response.statusText}`);
      return false;
    }

    toast.success('Data saved successfully!');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    toast.error(`Failed to save data to ${filename}: ${error}`);
    return false;
  }
}
