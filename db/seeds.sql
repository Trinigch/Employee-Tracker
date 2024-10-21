-- Insertar departamentos
INSERT INTO department (name) VALUES 
('Engineering'), 
('Human Resources'), 
('Sales');

-- Insertar roles
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 75000, 1),
('HR Manager', 60000, 2),
('Sales Representative', 50000, 3);

-- Insertar empleados
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Emily', 'Jones', 3, NULL);