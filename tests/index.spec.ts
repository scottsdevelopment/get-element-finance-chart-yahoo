import { getElementFinanceChartYahoo } from '../src/get-element-finance-chart-yahoo';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('get current ticket graph', () => {
    it('runs normally',  async (done) => {
        expect(getElementFinanceChartYahoo('BP')).to.be.fulfilled;
        expect(getElementFinanceChartYahoo('GME')).to.be.fulfilled;
        expect(getElementFinanceChartYahoo('AMC')).to.be.fulfilled;
        done();
    })

    it('throws chart not found error', async (done) => {
        expect(getElementFinanceChartYahoo('CHARTNOTFOUND')).to.be.rejectedWith('Chart not found or did not load correctly');
        done();
    });
});