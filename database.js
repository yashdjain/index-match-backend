const { Client } = require('pg');

const db = new Client({
    user: 'postgres',
    password: 'YcSLdOdZxQCTHCgjm1N1',
    host: 'containers-us-west-121.railway.app',
    port: '5546',
    database: 'railway'
  });

function createNewAccount(details) {
    db.query('INSERT INTO accounts(name, email, account_type, balance) VALUES ($1, $2, $3, $4)', details, (err, result) => {
        if (err) {
            console.error('Failed to insert data into db:', err);
        } else {
            console.log('Successfully inserted data into db'); // result.rows contains the fetched data
        }
    })
}

// Listen for notifications
// const accountTrigger = 
//     `CREATE FUNCTION notify_new_account()
//     RETURNS TRIGGER AS $$
//     BEGIN
//     PERFORM pg_notify('new_account', NEW.name || ',' || NEW.email || ',' || NEW.account_type || ',' || NEW.balance);
//     RETURN NEW;
//     END;
//     $$ LANGUAGE plpgsql;

//     CREATE TRIGGER new_account_trigger
//     AFTER INSERT ON accounts
//     FOR EACH ROW EXECUTE FUNCTION notify_new_account();`

// db.query(accountTrigger, (err, result) => {
//     if (err) {
//         console.error('Failed to insert data into db:', err);
//     } else {
//         console.log('Successfully inserted data into db'); // result.rows contains the fetched data
//     }
// })

db.connect((err, client, done) => {
    if(err) {
        console.log('Error');
    } else {
        console.log('Database connected');
        client.on('notification', (msg) => {
            const details = msg.payload.split(',');
            db.query('INSERT INTO logs(action, name, email, account_type, balance) VALUES (\'account-created\', $1, $2, $3, $4)', details, (err, result) => {
                if (err) {
                    console.error('Failed to insert data into db:', err);
                } else {
                    console.log('Successfully inserted data into db'); // result.rows contains the fetched data
                }
            })
        })
        const query = client.query('LISTEN new_account')
    }
})

module.exports = { createNewAccount };
