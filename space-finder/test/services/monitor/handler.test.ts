import { handler } from "../../../src/services/monitor/handler";


describe('Initial Test suite', () => {

    const spyFetch = jest.spyOn(global, 'fetch');
    spyFetch.mockImplementation(() => Promise.resolve({} as any));
    
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('Lambda requests for records in SnsEvent', async () => {
        await handler({
            Records: [{
                Sns: {
                    Message: 'Test Message'
                }
            }]
        } as any, {});

        expect(spyFetch).toHaveBeenCalledTimes(1);
        expect(spyFetch).toHaveBeenCalledWith(expect.any(String), {
            method: 'POST',
            body: JSON.stringify({
                Message: 'Test Message'
            })
        });
    });

    test('No sns records, no requests', async () => {
        await handler({
            Records: []
        } as any, {});

        expect(spyFetch).not.toHaveBeenCalledTimes(1);
    });
});
