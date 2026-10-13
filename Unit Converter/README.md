# Unit Converter

Convert everyday units locally with explicit definitions, configurable display precision and no external API.

## How to Use

1. Open **index.html**, select a category, and enter a number.
2. Choose **From** and **To** units. Results update immediately. Decimal points and scientific notation such as `1e3` are accepted; commas, fractions and hexadecimal input are not.
3. Use the swap icon to exchange unit selections while keeping the input value unchanged.
4. Copy the result or expand **All units for this value** to compare every unit in the category.
5. Expand **Display settings** to choose significant figures (1–15) or decimal places (0–15). `≈` means display rounding occurred. Reset restores the default category, units, value and precision while retaining theme.

## Features and Supported Units

| Category | Units |
| --- | --- |
| Length | Metre, kilometre, centimetre, millimetre, inch, international foot/yard/mile. |
| Area | Square metre/kilometre/centimetre/international foot, hectare, international acre. |
| Volume | Litre, millilitre, cubic metre, US liquid/Imperial gallons and fluid ounces. |
| Mass | Kilogram, gram, milligram, metric tonne, avoirdupois pound/ounce. |
| Temperature | Kelvin, Celsius, Fahrenheit; absolute-zero validation. |
| Speed | m/s, km/h, mph, ft/s, knot. |
| Time | Second, millisecond, minute, hour, 24-hour day, seven-day week. |
| Pressure | Pascal, kPa, MPa, bar, standard atmosphere, psi. |
| Energy | Joule, kJ, Wh, kWh, thermochemical calorie/kilocalorie. |
| Digital storage | Bit/byte, decimal kB–TB and binary KiB–TiB. |

Shared local SVG icons, top-right Light/Dark/System themes, responsive layout, keyboard focus and clipboard fallback are included. Currencies, calendar months/years and region-dependent land units are excluded.

## Definitions and Precision

Definitions follow conventional SI relationships and [NIST conversion guidance](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors). International inch = 0.0254 m; foot = 0.3048 m; mile = 1609.344 m; pound = 0.45359237 kg. The acre uses 43,560 international square feet. Survey units are not used.

US liquid gallon = 3.785411784 L, Imperial gallon = 4.54609 L. Their fluid ounces are respectively 1/128 and 1/160 gallon. Decimal storage uses powers of 1,000; binary prefixes use powers of 1,024. One byte is eight bits. Fractional storage results are allowed.

The thermochemical calorie is 4.184 J. Standard atmosphere is 101,325 Pa. Psi uses standard gravity (9.80665 m/s²), the international inch and avoirdupois pound. A knot uses the 1,852-metre nautical mile per hour.

Negative length, time and energy values are allowed as signed quantities; other multiplicative categories require non-negative values. Temperatures below absolute zero are rejected. Tiny floating-point errors within 1e-10 K below zero are clamped at the boundary.

Calculations use JavaScript binary floating-point, not arbitrary-precision decimal arithmetic. Results may contain floating-point error. Display rounding does not alter calculations. Large values may display in scientific notation, including decimal-place mode at magnitudes of 1e21 or more. Extremely small displayed values can round to zero with an approximation mark. Numeric overflow and conversions underflowing to zero are rejected; there is no claim of metrology-grade precision.

## Requirements and Installation

Keep the files together and open **index.html** in a modern browser with JavaScript enabled. No account, API key, framework, build step or Node.js is required. The downloaded tool works offline.

Optional HTTP serving from the repository root, with Python installed:

```sh
python -m http.server 8000
```

Open [the local tool](http://localhost:8000/Unit%20Converter/index.html). Stop the server with Ctrl+C.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Unit%20Converter/index.html)
- [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Unit%20Converter/index.html)

These target published main; local changes require publication. Availability is unverified.

## Privacy

Only theme, category, per-category unit selections and display precision are saved in `unit-converter-prefs`. Input values are session-only. Denied storage leaves the current page usable. Clipboard denial reveals selected result text for manual copying. No conversion data is sent anywhere and no external assets are loaded.

## Code and Tests

| File | Purpose |
| --- | --- |
| core.js | Unit definitions, numeric validation, base-unit conversion and display rounding. |
| app.js | Live conversion, unit selection, preferences and clipboard fallback. |
| icons.js | Shared local SVG icon style. |
| index.html / styles.css | Responsive interface and themes. |
| tests/ | Definition, round-trip, boundary and actual-browser checks. |

Node.js is only needed for developer checks:

```sh
node --test "Unit Converter/tests/core.test.cjs"
```

Browser checks require Playwright and installed Edge; set `PLAYWRIGHT_PATH` to the module folder if outside this repository:

```sh
node "Unit Converter/tests/browser.cjs"
```

## License and Contributions

[MIT](../LICENSE). [Report issues](https://github.com/KhemnarMayuresh/Tools/issues) with units, input and browser. Author: [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
