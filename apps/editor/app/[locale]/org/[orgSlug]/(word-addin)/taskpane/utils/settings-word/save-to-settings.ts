export async function saveToSettings<T>(key: string, value: T) {
  Office.context.document.settings.set(key, value);
}
