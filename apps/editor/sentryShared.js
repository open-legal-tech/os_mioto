export function beforeSend(event) {
  let shouldIgnore = false;
  event.exception.values.forEach((exception) => {
    // Füge hier deine eigene Logik hinzu, um zu entscheiden, ob du den Fehler ignorieren möchtest
    // Zum Beispiel, ignoriere alle Fehler, die eine bestimmte Nachricht enthalten
    if (
      exception?.value?.includes("NEXT_REDIRECT") ||
      exception?.value?.includes("NEXT_NOT_FOUND")
    ) {
      shouldIgnore = true;
    }
  });

  // Modify or drop the event here
  if (shouldIgnore) {
    return null;
  }

  return event;
}
