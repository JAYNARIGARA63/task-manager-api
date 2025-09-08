# Task Page (task.page.ts)

This file contains the logic to pick a file using **Capacitor File Picker** and upload it to a **Laravel API**.

---

## 📂 task.page.ts

```ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilePicker } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {
  constructor(private http: HttpClient) {}

  async pickFile() {
    try {
      // Open file picker
      const result = await FilePicker.pickFiles({
        multiple: false, // set true if you want multiple
        types: ['*/*']   // you can restrict like ['application/pdf','image/*']
      });

      if (result.files.length > 0) {
        const file = result.files[0];

        // Convert Base64 → Blob for upload
        const blob = this.b64toBlob(file.data!, file.mimeType);

        const formData = new FormData();
        formData.append('file', blob, file.name);

        // Upload to Laravel API
        this.http.post('https://your-laravel-api.com/api/upload', formData)
          .subscribe({
            next: (res) => console.log('✅ Upload success', res),
            error: (err) => console.error('❌ Upload error', err),
          });
      }
    } catch (err) {
      console.error('❌ File pick failed', err);
    }
  }

  // Helper: Base64 to Blob
  b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}
