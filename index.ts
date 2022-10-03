import { DirectoryWatcher, EventType } from './diractory-watcher';

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
