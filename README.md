# PhishShield 🛡️

**An Explainable Phishing URL Risk Analyzer — Chrome Extension**

PhishShield is a lightweight Chrome extension that analyzes URLs using multiple heuristic signals to estimate potential phishing risk. It provides a risk score, classification, and explanations for the signals detected.

## ✨ Features

- **URL Analysis:** Parses and validates HTTP and HTTPS URLs.
- **Risk Scoring:** Assigns a risk score from 0 to 100.
- **Explainable Results:** Displays the indicators contributing to the risk score.
- **Multiple Detection Signals:** Checks for insecure HTTP, IP-based hosts, punycode, suspicious URL structure, unusual ports, and account-related keywords.
- **Local Scan History:** Stores recent scans using Chrome's local storage.
- **Privacy-Focused:** Performs heuristic analysis locally without sending URLs to an external scanning service.
- **Unit Tests:** Includes automated tests using Node.js.

## 🧰 Tech Stack

- HTML5
- CSS3
- JavaScript
- Chrome Extensions Manifest V3
- Node.js test runner


## 🚀 Installation

1. Download or clone this repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the PhishShield project folder.
6. Click the PhishShield extension icon to scan a URL.

## 🧪 Running Tests

Install [Node.js](https://nodejs.org/) if it is not already installed.

Open a terminal in the project directory and run:

```powershell
node --test tests/analyzer.test.js
```

## 📊 Risk Scoring

PhishShield uses weighted heuristic signals to calculate a score between 0 and 100.

| Risk Score | Classification |
|---|---|
| 0–29 | Lower Risk |
| 30–59 | Medium Risk |
| 60–100 | High Risk |

The engine considers indicators such as HTTP usage, IP-address hosts, punycode, unusually long hostnames, excessive subdomains, non-standard ports, and suspicious URL patterns.

## ⚠️ Limitations

PhishShield is a heuristic-based educational project, not a complete security solution. A high score does not prove that a website is malicious, and a low score does not guarantee safety. The extension may produce false positives and false negatives.

Always verify suspicious websites independently. Do not enter sensitive information on a website you do not trust.

## 🔒 Privacy

URL analysis is performed locally by the extension. Scan history is stored using Chrome local storage. No external reputation API is required by the current implementation.

## 🔮 Future Improvements

- Integration with trusted threat-intelligence APIs.
- More advanced URL and domain analysis.
- Configurable risk thresholds.
- Expanded automated test coverage.
- Exportable scan history.

## 📄 License

This project is intended for educational and portfolio purposes. Add an explicit open-source license before permitting reuse under specific license terms.
