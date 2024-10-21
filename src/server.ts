import inquirer from 'inquirer';
import { pool } from './db/connection.js';  // Conexión a PostgreSQL

async function viewAllDepartments() {
  const { rows } = await pool.query('SELECT * FROM department');
  console.table(rows);
}

async function viewAllRoles() {
  const { rows } = await pool.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(rows);
}

async function viewAllEmployees() {
  const { rows } = await pool.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  console.table(rows);
}

async function mainMenu() {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
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
    default:
      pool.end();
      process.exit();
  }

  await mainMenu();
}

mainMenu();