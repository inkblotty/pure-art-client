import Datastore from 'nedb';

class Database {
    constructor(name) {
        this.db = new Datastore({ filename: `/Users/aarongreenspan/PureArt/pure-art-client/db/${name}.db`, autoload: true });
    }

    find(q) {
        return new Promise((res, rej) => {
            this.db.find(q || {}, (err, docs) => {
                if (err) rej(err);
                res(docs);
            });
        });
    }

    insert(obj) {
        return new Promise((res, rej) => {
            this.db.insert(obj, (err) => {
                if (err) rej(err);
                res();
            });
        });
    }

    remove(q) {
        return new Promise((res, rej) => {
            this.db.remove(q, (err) => {
                if (err) rej(err);
                res();
            });
        });
    }
}

const database = new Database('wallets');
export default database;
