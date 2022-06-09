import dayjs from 'dayjs';
import FormatEnum from '../enum/FormatEnum';

interface UserData {
    id: number;
    name: string;
    instagramToken: string;
    nickname: string;
    birthDate: string;
    smartphone: string;
    cpf: string;
    isActive: boolean;
}

interface DependentData {
    dependent: {
        id: number;
        name: string;
        dependentId: number;
        holderId: number;
    };
    relationship: {
        type: string;
    };
    holder: {
        id: number;
    };
}

interface AuthData {
    email: string;
    userId: number;
}

interface PerfilUserData {
    perfil: PerfilData;
}

interface PerfilData {
    channel: ChannelData;
}

interface ChannelData {
    id: number;
    channel: string;
}

interface ApartmentUserData {
    idUser: number;
    apartment: ApartmentData;
}

interface ApartmentData {
    idEnterprise: number;
    number: string;
}

interface EnterpriseData {
    id: number;
    name: string;
}

export default class User {
    private _id: number | undefined;
    private _name: string | undefined;
    private _nickname: string | undefined;
    private _birthDate: string | undefined;
    private _smartphone: string | undefined;
    private _document: string | undefined;
    private _documentType: string | undefined;
    private _nacionalidade: string | undefined;
    private _cpf: string | undefined;
    private _firstLogin: string | undefined;
    private _urlAttachment: string | undefined;
    private _instagramToken: string | undefined;
    private _createdAt: string | undefined;
    private _updatedAt: string | undefined;
    private _active: boolean | undefined;
    private _backofficeItems: number[] | undefined;
    private _allUsers: UserData[] | undefined;

    public getId(): number {
        return <number>this._id;
    }

    public setId(id: number) {
        this._id = id;
    }

    public getName(): string {
        return <string>this._name;
    }

    public setName(name: string) {
        this._name = name;
    }

    public getbackofficeItems() {
        return this._backofficeItems;
    }

    public setbackofficeItems(backofficeItems: number[]) {
        this._backofficeItems = backofficeItems;
    }

    public getNickname(): string {
        return <string>this._nickname;
    }

    public setNickname(nickname: string) {
        this._nickname = nickname;
    }

    public getBirthDate(): string {
        return <string>this._birthDate;
    }

    public setBirthDate(birthDate: string) {
        this._birthDate = birthDate;
    }

    public getSmartphone(): string {
        return <string>this._smartphone;
    }

    public setSmartphone(smartphone: string) {
        this._smartphone = smartphone;
    }

    public getNacionalidade(): string {
        return <string>this._nacionalidade;
    }

    public setNacionalidade(nacionalidade: string) {
        this._nacionalidade = nacionalidade;
    }

    public getUrlAttachment(): string {
        return <string>this._urlAttachment;
    }

    public setUrlAttachment(urlAttachment: string) {
        this._urlAttachment = urlAttachment;
    }

    public getCpf(): string {
        return <string>this._cpf;
    }

    public setCpf(cpf: string) {
        this._cpf = cpf;
    }

    public getDocument(): string {
        return <string>this._document;
    }

    public setDocument(document: string) {
        this._document = document;
    }

    public getDocumentType(): string {
        return <string>this._documentType;
    }

    public setDocumentType(documentType: string) {
        this._documentType = documentType;
    }

    public getFirstLogin(): string {
        return <string>this._firstLogin;
    }

    public setFirstLogin(firstLogin: string) {
        this._firstLogin = firstLogin;
    }

    public getInstagramToken(): string {
        return <string>this._instagramToken;
    }

    public setInstagramToken(instagramToken: string) {
        this._instagramToken = instagramToken;
    }

    public getCreatedAt(): string {
        return <string>this._createdAt;
    }

    public setCreatedAt = () => {
        this._createdAt = dayjs().format(FormatEnum.DATETIME_FORMAT);
    };

    public getUpdatedAt(): string {
        return <string>this._updatedAt;
    }

    public setUpdatedAt = () => {
        this._updatedAt = dayjs().format(FormatEnum.DATETIME_FORMAT);
    };

    public getActive(): boolean {
        return <boolean>this._active;
    }

    public setActive(active: boolean) {
        this._active = active;
    }

    public setAllUsers(users: UserData[]) {
        this._allUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            nickname: user.nickname,
            birthDate: user.birthDate,
            smartphone: user.smartphone,
            instagramToken: user.instagramToken,
            cpf: user.cpf,
            isActive: user.isActive,
        }));
    }

    public getAllUsers() {
        return this._allUsers;
    }

    public formatDependentData(dependents: DependentData[]) {
        return dependents.map((dependentData: DependentData) => {
            return {
                id: dependentData.dependent.id,
                name: dependentData.dependent.name,
                type: dependentData.relationship.type,
            };
        });
    }

    public findUserEmail(userId: number, authData: AuthData[]) {
        const userAuth = authData.filter((auth: AuthData) => {
            return auth.userId == userId;
        });

        return userAuth[0]?.email;
    }

    public findEnterpriseName(
        enterpriseId: number,
        enterpriseData: EnterpriseData[],
    ) {
        const enterprise = enterpriseData.filter(
            (enterprise: EnterpriseData) => {
                return enterprise.id == enterpriseId;
            },
        );

        return enterprise[0]?.name;
    }

    public findHolderByUser(
        dependentId: Number,
        dependentData: DependentData[],
    ) {
        const dependent = dependentData.filter((dependent: DependentData) => {
            return dependent.dependent.id == dependentId;
        });

        return dependent[0]?.holder.id;
    }

    public findUserApartment(
        userId: number,
        apartmentUserData: ApartmentUserData[],
    ) {
        const userApartment = apartmentUserData.filter(
            (apartment: ApartmentUserData) => {
                return apartment.idUser == userId;
            },
        );

        return {
            idEnterprise: userApartment[0]?.apartment.idEnterprise,
            number: userApartment[0]?.apartment.number,
        };
    }

    public filterUserData(
        userData: UserData[],
        authData: AuthData[],
        apartmentUserData: ApartmentUserData[],
        enterpriseData: EnterpriseData[],
        dependentData: DependentData[],
    ) {
        return userData.map((userData: UserData) => {
            let { number, idEnterprise } = this.findUserApartment(
                userData.id,
                apartmentUserData,
            );

            if (!idEnterprise) {
                const holderId = this.findHolderByUser(
                    userData.id,
                    dependentData,
                );
                if (holderId) {
                    const apartment = this.findUserApartment(
                        holderId,
                        apartmentUserData,
                    );

                    number = apartment.number;
                    idEnterprise = apartment.idEnterprise;
                }
            }

            return {
                ...userData,
                email: this.findUserEmail(userData.id, authData),
                apartmentNumber: number,
                enterprise: this.findEnterpriseName(
                    idEnterprise,
                    enterpriseData,
                ),
            };
        });
    }

    public verifyUserAccess(perfilUserData: PerfilUserData[]) {
        const userMobileAccess = perfilUserData.filter(
            (perfilUser: PerfilUserData) => {
                return (
                    perfilUser.perfil.channel.id == 1 ||
                    perfilUser.perfil.channel.id == 2
                );
            },
        );
        return userMobileAccess.length > 0;
    }
}
