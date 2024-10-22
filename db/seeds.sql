      
-- Insertar datos en la tabla movies
INSERT INTO department (name) VALUES 
('Engineering'), 
('Human Resources'), 
('Sales'),
('Software Engineering'),
('Electronic Engineering'), 
('Mecanic Engineering');

-- Insertar roles
INSERT INTO role (title, salary, department_id) VALUES
('Engineer', 75000, 1),
('HR Manager', 60000, 2),
('Sales', 50000, 3),
('Software Engineering', 75000, 4),
('Electronic Engineering', 85000, 5), 
('Mecanic Engineering', 95000, 6);

-- Insertar empleados
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'blanch', 5, NULL),
('Juana', 'Smith', 2, 1),
('Emily', 'Marones', 4, NULL),
('Maria', 'Doe', 1, NULL),
('Elena', 'moritana', 2, 1),
('Emilia', 'Jones', 4, NULL);