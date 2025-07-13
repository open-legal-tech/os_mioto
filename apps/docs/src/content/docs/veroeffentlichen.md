---
title: Veröffentlichen und Einbinden
description: Wie man Mioto-Anwendungen veröffentlicht und einbindet.
---

Anwendungen können veröffentlicht und durch einen Link abgerufen werden.

### Veröffentlichung der Anwendung

Deine fertige Anwendung kannst du im Projekt-Menü veröffentlichen, welches du öffnest, indem du im Builder auf den Namen klickst.

An dieser Stelle findest du auch den Link zu deiner veröffentlichten Anwendung, den du kopieren kannst.

Über diesen Link ist deine Anwendung aufrufbar. Du kannst den Link mit anderen teilen oder selbst darauf zugreifen.

### Einbinden in eine Webseite

Willst du deine Anwendung in eine Webseite einbinden, steht dir das HTML-Element iframe zur Verfügung.

Dabei musst du als Quelle des iframe lediglich den Link zu deiner Anwendung festlegen und den iframe an der gewünschten Stelle auf deiner Webseite platzieren.

Der Code könnte so aussehen:

```jsx
  <iframe src="https://mioto.app/public/BAUMID" width="640" height="640" style="border:none;"></iframe>
```

Anstelle von *BAUMID* steht in deinem Link eine zufällige Zeichenfolge.

Mehr über den iframe-Tag: [https://www.w3schools.com/tags/tag_iframe.ASP](https://www.w3schools.com/tags/tag_iframe.ASP "")
