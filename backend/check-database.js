#!/usr/bin/env node

const { Sequelize } = require("sequelize");

console.log('\n🗄️  DATABASE VERIFICATION\n');
console.log('=================================\n');

const sequelize = new Sequelize("pg_management", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

async function checkDatabase() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Connected to MySQL database\n');

        // Query users
        const result = await sequelize.query(
            "SELECT id, name, email, role, isVerified, createdAt FROM Users ORDER BY createdAt DESC LIMIT 10"
        );

        const users = result[0];

        if (users.length === 0) {
            console.log('⚠️  No users found in database\n');
        } else {
            console.log(`✅ Found ${users.length} user(s):\n`);
            console.log('ID | Name           | Email                    | Role   | Verified | Created');
            console.log('---|----------------|--------------------------|--------|----------|-------------------');

            users.forEach(user => {
                const name = user.name.padEnd(14);
                const email = user.email.padEnd(24);
                const role = (user.role || 'N/A').padEnd(6);
                const verified = user.isVerified ? 'Yes' : 'No ';
                const created = new Date(user.createdAt).toLocaleString();
                console.log(`${user.id} | ${name} | ${email} | ${role} | ${verified}      | ${created}`);
            });
        }

        console.log('\n=================================\n');
        console.log('✅ Database check completed!\n');

    } catch (err) {
        console.error('❌ Database error:', err.message);
        console.log('\nMake sure:');
        console.log('- MySQL is running');
        console.log('- Database "pg_management" exists');
        console.log('- User "root" with password "root" exists\n');
    } finally {
        await sequelize.close();
    }
}

checkDatabase();
