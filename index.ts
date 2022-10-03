import { readdirSync, stat, lstatSync } from 'node:fs';
import path = require('node:path');
import { DirectoryWatcher, EventType } from './diractory-watcher';

export function test() {
  const dir = './';
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileStat = lstatSync('foo');
    console.log(filePath);
    console.log(fileStat);
    console.log(fileStat.isDirectory());
  });
}

const watcher = new DirectoryWatcher('./');

watcher.on(EventType.CREATE, () => {
  console.log('新建');
});
watcher.on(EventType.DELETE, () => {
  console.log('删除');
});

watcher.on(EventType.MODIFY, () => {
  console.log('修改');
});

watcher.startWatch();
