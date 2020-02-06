import { acronymMapper } from '../../../addSourceWizard/schemaBuilder';

describe('schemaBuilder helper tests', () => {
    describe('acronym mapper', () => {
        it('changes Amazon to AWS', () => {
            expect(acronymMapper('Amazon Web Services')).toEqual('AWS');
        });

        it('does not change anything else', () => {
            expect(acronymMapper('Anything else')).toEqual('Anything else');
        });
    });
});
