# MCC-sofaskin 

This is a custom WeeWX skin based on [Sofaskin-CW9009](https://github.com/weatherstorm/Sofaskin-CW9009)

Features:

- Everything rewritten using TailwindCSS
- Live data updates using MQTT
- JS interactive plots on homepage

![homepage_screenshot](screenshot.png)

You can see the live version on my website at [meteocentrocadore.it](https://meteocentrocadore.it)

## TODO
Please note that the skin is still in active development and it's not production ready

- [x] Make Webcam and radar optional
- [ ] Make everything configurable via skin.conf
- [x] Implement translation
- [ ] Rework js plot implementation
- [ ] Rework mqtt implementation
- [ ] Auto install via weectl extension


## Installation

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
