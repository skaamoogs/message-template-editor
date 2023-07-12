class StorageService {
  get(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      const itemWrap = JSON.parse(item);
      return itemWrap.type === "object"
        ? JSON.parse(itemWrap.item)
        : itemWrap.item;
    }
    return null;
  }

  set(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify(this.createItemWrap(item)));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  protected createItemWrap(item: any) {
    const itemType = typeof item;
    const itemString = itemType === "object" ? JSON.stringify(item) : item;

    return {
      item: itemString,
      type: itemType,
    };
  }
}

export const storageService = new StorageService();
