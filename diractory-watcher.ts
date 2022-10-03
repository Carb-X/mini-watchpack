import { EventEmitter } from 'events';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import { FileWatcher } from './file-watcher';

export enum EventType {
  CREATE = 'CREATE',
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
}

export class DirectoryWatcher extends EventEmitter {
  private dirPath: string; // 监听的文件目录
  private isFirstScan: boolean; // 是否为第一次扫描
  private fileWatcherMap: Map<string, FileWatcher>;

  constructor(dirPath: string) {
    super();
    this.dirPath = dirPath;
    this.fileWatcherMap = new Map();
    this.isFirstScan = true;
    this.mountFileWatcher(dirPath);
  }

  // 挂载 fileWatcher
  private mountFileWatcher(dirPath: string) {
    const fileNames = readdirSync(dirPath);
    fileNames.forEach((fileName) => {
      const filePath = join(dirPath, fileName);
      if (lstatSync(filePath).isDirectory()) {
        this.mountFileWatcher(filePath);
      } else {
        if (!this.fileWatcherMap.has(filePath)) {
          this.fileWatcherMap.set(filePath, new FileWatcher(filePath, this));
        }
      }
    });
  }

  // 删除 fileWatcher
  removeFileWatcher(filePath: string) {
    this.fileWatcherMap.delete(filePath);
  }

  // 开始监听
  startWatch() {
    Array.from(this.fileWatcherMap.values()).forEach((watcher) => {
      watcher.checkState(this.isFirstScan);
    });
    this.isFirstScan = false;
    setInterval(() => {
      this.mountFileWatcher(this.dirPath);
      Array.from(this.fileWatcherMap.values()).forEach((watcher) => {
        watcher.checkState(this.isFirstScan);
      });
    }, 1000);
  }
}
