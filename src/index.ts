import puppeteer from 'puppeteer';

export async function getElementFinanceChartYahoo(symbol: string, viewPort: '1D' | '1W' = '1D', interval: '1 min' | '1 hour' = '1 min'): Promise<string | void | Buffer> {
      // Wait for browser launching.
      const browser = await puppeteer.launch({
      });

      // Wait for creating the new page.
      const page = await browser.newPage();

      // Goto the chart page
      await page.goto(`https://finance.yahoo.com/chart/${symbol}`);

      // Wait for the graph to load.
      await page.waitForSelector('html[ciq-last-interaction]')

      try { 
            // This chart is not available check
            const chartAvailableCheck = await page.waitForXPath('//span[contains(.,"This chart is not available")]', { timeout: 25 });

            if (chartAvailableCheck !== null) {
                  throw Error('This chart is not available');
            }
      } catch(err) {
            // fall through
      }

      // Open mini history range port
      const buttonMiniRange = await page.waitForSelector('.miniRangeBtn');
      buttonMiniRange?.click();

      // Select view port icon
      const button1dChart = await page.waitForXPath(`//*[@id="miniRange"]/li/button[contains(.,"${viewPort}")]`);
      button1dChart?.click();

      await page.waitForTimeout(1000);

      // Open mini history range port
      const buttonInterval = await page.waitForSelector('.intervalBtn');
      buttonInterval?.click();

      // Set history view port interval
      const button1HInterval = await page.waitForXPath(`//*[@id="presetList"]/li/button[contains(.,"${interval}")]`);
      button1HInterval?.click();

      // Wait for graph element
      const graph = await page.waitForSelector('.stx-holder.stx-panel-chart');

      // Remove the zoom in and out buttons
      await page.evaluate(() => {
            let example = document.querySelector('.stx-zoom-out');
            if (example) {
                  // @ts-ignore
                  example.style.display = 'none';
            }
      });

      await page.evaluate(() => {
            let example = document.querySelector('.stx-zoom-in');
            if(example) {
                  // @ts-ignore
                  example.style.display = 'none';
            }
      });

      await graph?.screenshot({path: 'ticker.png'});

      browser.close();
}