
/*
* Copyright (C) 2018 The ontology Authors
* This file is part of The ontology library.
*
* The ontology is free software: you can redistribute it and/or modify
* it under the terms of the GNU Lesser General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* The ontology is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public License
* along with The ontology.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Account } from '../../src/account';
import { Address, PublicKey } from '../../src/crypto';
import { PrivateKey } from '../../src/crypto';
import { CurveLabel } from '../../src/crypto/CurveLabel';
import { KeyParameters } from '../../src/crypto/Key';
import { ERROR_CODE } from '../../src/error';
import { KeyType } from '../../src/crypto/KeyType';

describe('test account', () => {

    // tslint:disable-next-line:one-variable-per-declaration
    let privateKey: PrivateKey,
        accountDataStr: string,
        account: Account,
        encryptedPrivateKey: PrivateKey;

    beforeAll(() => {
        privateKey = PrivateKey.random();
        // console.log(privateKey.serializeJson())
        // console.log(privateKey.serializeWIF());
    });

    test('test create', () => {
        account = Account.create(privateKey, '123456', 'mickey');
        encryptedPrivateKey = account.encryptedKey;
        accountDataStr = account.toJson();
        // tslint:disable-next-line:no-console
        console.log('account: ' + accountDataStr);
        expect(accountDataStr).toBeDefined();
        // tslint:disable:no-console
        console.log('address: ' + account.address.toBase58());
        console.log('privateKey: ' + privateKey);
        console.log('addressU160: ' + account.address.serialize());

        const pub = '120202d3d048aca7bdee582a611d0b8acc45642950dc6167aee63abbdcd1a5781c6319';
        console.log('Address: ' + Address.fromPubKey(new PublicKey(pub)).toBase58());
    });
    test('test import account with correct password', () => {
        const a = Account.importAccount('mickey', encryptedPrivateKey, '123456', account.address, account.salt);
        const pri = a.exportPrivateKey('123456');
        expect(pri.key).toEqual(privateKey.key);
        expect(a.label).toBe('mickey');

    });
    test('test import  with incorrect password', () => {
        try {
            Account.importAccount('mickey', encryptedPrivateKey, '1234567', account.address, account.salt);
            fail(new Error('Expected to throw an error'));
        } catch (err) {
            expect(err).toEqual(ERROR_CODE.Decrypto_ERROR);
        }

    });

    test('create_sm2', () => {
        const keyParameter = new KeyParameters(CurveLabel.SM2P256V1);
        const pri = PrivateKey.random(KeyType.SM2, keyParameter);
        const acc = Account.create(pri, '123456', 'sm2Account');
        console.log('addr: ' + acc.address.toBase58());
        const accJson = acc.toJsonObj();
        console.log(accJson);
        expect(accJson.algorithm).toEqual('SM2');
    });

    test('memonic_import', () => {
        const memonic = 'melody snake text depend please copper best flower cushion open marriage cool';
        const accout = Account.importWithMnemonic('test', memonic, '123456');
        console.log(accout);
    });
});
