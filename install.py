from setup import ExtensionInstaller

def loader():
    return MccInstaller()

class MccInstaller(ExtensionInstaller):
    def __init__(self):
        super(MccInstaller, self).__init__(
            version="0.1.0",
            name='MCC-skin',
            description='Modern Weewx skin',
            author="Nicolò Frescura",
            author_email="nicolo.frescura@pm.me",
            config={
                'StdReport': {
                    'MCC-skin': {
                        'skin': 'MCC-skin',
                        'enable': 'true',
                        'lang': 'en',
                    }
                }
            },
            files=[
                ('bin/user', [
                    'bin/user/historygenerator.py',
                ]),
                ('skins/MCC-skin', [
                    'skins/MCC-skin/skin.conf',
                    'skins/MCC-skin/build.css',
                    'skins/MCC-skin/index.html.tmpl',
                    'skins/MCC-skin/week.html.tmpl',
                    'skins/MCC-skin/month.html.tmpl',
                    'skins/MCC-skin/year.html.tmpl',
                    'skins/MCC-skin/summary.html.tmpl',
                    'skins/MCC-skin/station.html.tmpl',
                    'skins/MCC-skin/webcam.html.tmpl',
                    'skins/MCC-skin/text.php.tmpl',
                    'skins/MCC-skin/favicon.ico',
                    'skins/MCC-skin/robots.txt',
                    'skins/MCC-skin/touch-icon.png',
                ]),
                ('skins/MCC-skin/js', [
                    'skins/MCC-skin/js/charts.js.tmpl',
                    'skins/MCC-skin/js/checkdiff.js.tmpl',
                    'skins/MCC-skin/js/liveUpdates.js.tmpl',
                    'skins/MCC-skin/js/modernizr-2.6.2.min.js',
                ]),
                ('skins/MCC-skin/json', [
                    'skins/MCC-skin/json/day.json.tmpl',
                ]),
                ('skins/MCC-skin/lang', [
                    'skins/MCC-skin/lang/en.conf',
                    'skins/MCC-skin/lang/it.conf',
                ]),
                ('skins/MCC-skin/NOAA', [
                    'skins/MCC-skin/NOAA/NOAA-Records.txt.tmpl',
                    'skins/MCC-skin/NOAA/NOAA-YYYY-MM.txt.tmpl',
                    'skins/MCC-skin/NOAA/NOAA-YYYY.txt.tmpl',
                ]),
                ('skins/MCC-skin/RSS', [
                    'skins/MCC-skin/RSS/weewx_rss.xml.tmpl',
                ]),
                ('skins/MCC-skin/templates', [
                    'skins/MCC-skin/templates/footer.html.tmpl',
                    'skins/MCC-skin/templates/head.html.tmpl',
                    'skins/MCC-skin/templates/header.html.tmpl',
                ]),
            ]
        )