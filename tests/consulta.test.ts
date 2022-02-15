import { ConsultBinRequestModel } from './../src/domain/Consults/index';
import { CieloConstructor, Cielo } from './../src/cielo';
import test from 'tape';

const cieloParams: CieloConstructor = {
    merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
    merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
    console.log('Ocorreu o seguinte erro', err);
}

test(`Consulta BIN`, async t => {
    const consultaBinNacionalParams: ConsultBinRequestModel = {
        cardBin: '453211',
    };
    const consultaBin = cielo.getConsult();
    const consultaBinNacional = await consultaBin
        ?.bin(consultaBinNacionalParams)
        .catch(error);
    if (consultaBinNacional) {
        t.assert(consultaBinNacional.foreignCard === true, 'Consulta bin OK');
    }

    t.end();
});
