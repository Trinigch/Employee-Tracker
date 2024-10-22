import express from 'express';
import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
//import figlet from 'figlet';

await connectToDb();
const app = express();
// Express middleware
app.use(express.json());

// Function to view all departments
async function viewAllDepartments() {
    const { rows } = await pool.query('SELECT * FROM department');
    console.table(rows);
}

// Function to view all roles
async function viewAllRoles() {
    const { rows } = await pool.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    console.table(rows);
}

// Function to view all employees
async function viewAllEmployees() {
    const { rows } = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, 
               department.name AS department, role.salary, manager.first_name AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(rows);
}

// Function to add a department
async function addDepartment() {
    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
    });
    await pool.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
    console.log(`Department '${departmentName}' added successfully.`);
}

// Function to add a role
async function addRole() {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({
        name: department.name,
        value: department.id,
    }));

    const { roleName, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
            validate: input => {
                const salaryValue = parseFloat(input);  
               
                return !isNaN(salaryValue) && salaryValue > 0 
                    ? true 
                    : 'Please enter a valid positive number.';
            },
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for this role:',
            choices: departmentChoices,
        },
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [roleName, salary, departmentId]);
    console.log(`Role '${roleName}' added successfully.`);
}

// Function to add an employee
async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const managers = await pool.query('SELECT * FROM employee');
    const managerChoices = managers.rows.map(manager => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
    }));

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the employee\'s role:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'managerId',
            message: 'Select the employee\'s manager:',
            choices: managerChoices,
            default: null,  // Allow for a case where the employee might not have a manager
        },
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    console.log(`Employee '${firstName} ${lastName}' added successfully.`);
}

// Function to update an employee's role
async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'newRoleId',
            message: 'Select the new role for this employee:',
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
    console.log(`Employee role updated successfully.`);
}

// Main menu function
async function mainMenu() {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        default:
            pool.end();
            process.exit();
    }
    await mainMenu();
}

// Start the application
mainMenu();