import Axios from 'axios';
import debug from "debug";
import base64Encode from "../../utils/base64Encode";
import base64Decode from "../../utils/base64Decode";

export default class CryptIntegrationGateway {

    private logger = debug("user-api: CryptIntegrationGateway")
    private cryptIntegration = Axios.create({
        baseURL: `${process.env.CRYPT_HOST}/v1/crypt-integration`,
    })

    public encryptData = async (str: string) => {

        const strEncode = base64Encode(str)
        const { data } = await this.cryptIntegration.get(`/encrypt/${strEncode}`);

        this.logger("Response crypt-integration\n", data)
        return data.encrypted
    }

    public decryptData = async (str: string) => {
        const { data } = await this.cryptIntegration.get(`decrypt/${str}`);
        const strDecoded = base64Decode(data.decrypted)
        this.logger("Response crypt-integration\n", strDecoded)
        return strDecoded
    }
}