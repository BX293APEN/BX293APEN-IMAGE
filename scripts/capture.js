const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(
    async () => {
        // 保存先ディレクトリ
        const dir = path.join(__dirname, '../assets');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // サイズ配列
        const widths = [620, 1024, 1280];
        const heights = [190, 600, 720];

        // img/ ディレクトリ内のHTMLファイル一覧
        const htmlDir = path.join(__dirname, '../img');
        const files = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));

        const browser = await puppeteer.launch(
            {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        );

        const page = await browser.newPage();

        // ループで処理
        for (let i = 0; i < files.length; i++) {
            const filePath = path.join(htmlDir, files[i]);
            const html = fs.readFileSync(filePath, 'utf-8');

            const defaultWidth = 1200;
            const defaultHeight = 800;

            const w = widths[i] !== undefined ? widths[i] : defaultWidth;
            const h = heights[i] !== undefined ? heights[i] : defaultHeight;
            
            
            await page.setViewport(
                {
                    width: w,
                    height: h
                }
            );

            await page.setContent(html);

            const outName = `${path.basename(files[i], '.html')}_${w}x${h}.png`;
            await page.screenshot({ path: path.join(dir, outName) });

            console.log(`Generated screenshot: ${outName}`);
            
        }
        
        await browser.close();
    }
)();
