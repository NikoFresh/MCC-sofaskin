# MCC-sofaskin

![GitHub License](https://img.shields.io/github/license/NikoFresh/MCC-sofaskin)
![WeeWX](https://img.shields.io/badge/WeeWX-5.0%2B-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![GitHub last commit](https://img.shields.io/github/last-commit/NikoFresh/MCC-sofaskin)

A modern, mobile-first skin for WeeWX weather station software. Originally based on [Sofaskin-CW9009](https://github.com/weatherstorm/Sofaskin-CW9009), It's been extensively rewritten.

Features:

- Everything rewritten using TailwindCSS
- Live data updates using MQTT
- JS interactive plots on homepage
- Mobile-first layout
- Webcam / Radar buttons written with CSS

[- The skin is fully accessible with JavaScript disabled]: #

And those additional features from Sofaskin-CW9009:

- Warning when the page has not been updated in the last 30 minutes
- PHP page template to view the NOAA climate text files

I haven't personally tested the skin on older version of WeeWX, but It's working fine on v5.1 and should be working on 5.0.

---

![homepage_screenshot](screenshot.png)

You can see the live version on my website at [meteocentrocadore.it](https://meteocentrocadore.it)

## Configuration

You can configure everything editing `skin.conf`:

```conf
[Extras]
    # Website URL
    web_url = 

    # Current radar image
    # radar_url = 
    
    # Webcam image
    # webcam_url = 

    # Footer
    email = ""
    copyright_name = ""

    # Umami
    # umami_enable = true
    # umami_id = 

    # Cronitor link
    # cronitor_url = 

    ##### MQTT #####
    mqtt_enable = false
    mqtt_broker = test.mosquitto.org
    mqtt_port = 8081
    mqtt_topic = 
```

You can enable or disable webcam and radar by commenting out the corresponding lines.

For cronitor, I have developed a related extension [weewx-cronitor](https://github.com/NikoFresh/weewx-cronitor). This will enable a link on the footer and on the old-data warning.

Please note that I have only tested MQTT with this mosquitto test server.

## TODO

- [x] Make Webcam and radar optional
- [x] Make everything configurable via skin.conf
- [x] Implement translation
- [x] Rework mqtt implementation
- [ ] Rework js graphs implementation
- [ ] Update data on graphs with MQTT
- [ ] Auto install via weectl extension

## Installation

> [!WARNING]
> This skin is still in active development and is **not production ready**. Use at your own risk.

1. Download the latest skin from [this repository](https://github.com/NikoFresh/MCC-sofaskin/archive/master.zip)
2. Unzip the files and copy the folder to `/etc/weewx/skins`
3. Copy `bin/user/historygenerator.py` to `/etc/weewx/bin/user`
4. Enable skin on `weewx.conf`

## Credits

Thanks to neoground for the [original Sofaskin](https://neoground.com/projects/sofaskin?lang=en) and to weatherstorm for the awesome [CW90009 version](https://github.com/weatherstorm/Sofaskin-CW9009).

---

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
