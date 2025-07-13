---
title: Template einbinden
description: Wie man das Design von Mioto-Anwendungen anpasst.
---

### Schritt 1: Erstellen des Dokument-Blocks

Zunächst muss bestimmt werden, wo in der Anwendung ein Dokument generiert werden soll. Dort kann ein entsprechender Block vom Typ *Dokument* erstellt werden. 

Es sollte sichergestellt werden, dass alle im Dokument verwendeten Variablen aus Nutzer:inneneingaben resultieren, die vor Erreichen des Dokumentenblocks von der Anwendung erhoben wurden. Nutzer:inneneingaben können durch Eingabeblöcke erhoben werden.

Dokument-Blöcke können an beliebiger Stelle erstellt werden. Es können mehrere Dokument-Blöcke in einer Anwendung erstellt werden.

### Schritt 2: Erstellung des Templates

Das Template wird als gängiges Word-Dokument erstellt und gespeichert (.docx). Die Gestaltung ist dabei völlig frei. Dort wo Variablen eingebunden werden oder Bedingungslogik verwendet werden soll, wird eine Template-Sprache verwendet, die mit geschweiften Klammern gekennzeichnet wird. Diese dürfen im übrigen Word-Template deshalb nicht benutzt werden.

```
{Abfrage.Vor_und_Nachname}, wohnhaft in {Abfrage.Wohnort} hat innerhalb von 14 Tagen die Zahlung auf das Konto mit der IBAN {Abfrage.IBAN_des_Empfaengers} zu leisten. 
```

[→ Zur Template-Sprache](/docs/template-sprache "Template-Sprache")

Ein Dokument muss keine Template-Sprache enthalten, um in einer Mioto-Anwendung verwendet zu werden. Es kann auch sinnvoll sein, statische Dokumente im Workflow einzubinden.

### Schritt 3: Hochladen des Templates

Im Block-Editor des Dokument-Blocks kann das Template hochgeladen werden. Beim Hochladen wird eine Validierung des Templates durchgeführt. Wenn die Validierung erfolgreich ist, wird das hochgeladene Template gespeichert und kann jetzt verwendet.

Wenn die Validierung fehlschlägt, wird eine Fehlermeldung mit Hinweisen zu Fehlern im Template angezeigt. Dabei wird jedoch nur überprüft, ob die Template-Sprache überall korrekt verwendet wurde. Die Korrektheit der Variablennamen oder ob eine Variable immer verfügbar ist, wird nicht überprüft. Nach Behebung der Fehler muss das Template erneut hochgeladen werden, da eine Dokumentenerstellung nur mit einem validen Template möglich ist.

### Schritt 4: Testen

Insbesondere bei komplexeren Dokumenten unterlaufen bei der Erstellung schnell Fehler. Die Dokumentenerstellung sollte deshalb ausführlich über den Prototypen am oberen Bildschirmrand getestet werden, bevor sie veröffentlicht wird.
