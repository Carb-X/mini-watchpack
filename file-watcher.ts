import { existsSync, lstat, lstatSync } from 'fs';
import { DirectoryWatcher, EventType } from './diractory-watcher';

export class FileWatcher {
  private filePath: string; // 文件路径
  private lastMTime: number; // 上次修改时间
  private isFirstWatch: boolean; // 是否为第一次监视
  private dirWatcher: DirectoryWatcher; // 所属的 DirectoryWatcher

  constructor(filePath: string, dirWatcher: DirectoryWatcher) {
    this.filePath = filePath;
    this.dirWatcher = dirWatcher;
    this.isFirstWatch = true;
  }

  // 检查文件状态，触发相应事件
  checkState(isFirstScan: boolean): void {
    try {
      const fileState = lstatSync(this.filePath);
      // 新建事件
      if (!isFirstScan && this.isFirstWatch) {
        this.dirWatcher.emit(EventType.CREATE);
        this.isFirstWatch = false;
        this.lastMTime = fileState.mtimeMs;
        return;
      }
      // 修改事件
      if (!isFirstScan && this.lastMTime != fileState.mtimeMs) {
        this.dirWatcher.emit(EventType.MODIFY);
      }
      this.isFirstWatch = false;
      this.lastMTime = fileState.mtimeMs;
    } catch (err) {
      this.dirWatcher.removeFileWatcher(this.filePath);
      this.dirWatcher.emit(EventType.DELETE);
    }
  }
}
