export interface SQLChallenge {
  id: string;
  title: string;
  slug: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  section: 'basics' | 'intermediate' | 'advanced';
  concept: string;
  order: number;
  prompt: string;
  setup: string;
  solution: string;
  orderMatters: boolean;
  schemaNote: string;
  starterCode: string;
}

export const sqlChallenges: SQLChallenge[] = [
  // ==========================================
  // BASICS
  // ==========================================
  {
    id: 'sql-b1',
    title: 'Long Streaming Sessions',
    slug: 'long-streaming-sessions',
    difficulty: 'basic',
    section: 'basics',
    concept: 'SELECT & WHERE',
    order: 1,
    prompt: 'StreamHub logs every listening/watching session. Return session_id, user_id, and minutes_played for sessions where minutes_played is greater than 30.',
    setup: `
      CREATE TABLE sessions(session_id INTEGER, user_id INTEGER, app_name TEXT, minutes_played INTEGER, session_date TEXT);
      INSERT INTO sessions VALUES
      (1,101,'BeatWave',45,'2026-06-02'),
      (2,102,'BeatWave',12,'2026-06-03'),
      (3,101,'ClipStream',60,'2026-06-05'),
      (4,103,'BeatWave',5,'2026-06-06'),
      (5,104,NULL,25,'2026-06-07'),
      (6,102,'ClipStream',80,'2026-06-08'),
      (7,105,'BeatWave',33,'2026-06-10'),
      (8,101,'BeatWave',20,'2026-06-11'),
      (9,103,'ClipStream',50,'2026-06-15'),
      (10,106,'BeatWave',15,'2026-07-01');
    `,
    solution: 'SELECT session_id, user_id, minutes_played FROM sessions WHERE minutes_played > 30;',
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b2',
    title: 'Top 3 Longest Sessions',
    slug: 'top-3-longest-sessions',
    difficulty: 'basic',
    section: 'basics',
    concept: 'ORDER BY & LIMIT',
    order: 2,
    prompt: 'Return session_id and minutes_played for the 3 longest sessions, ordered from longest to shortest.',
    setup: '__SESSIONS__',
    solution: 'SELECT session_id, minutes_played FROM sessions ORDER BY minutes_played DESC LIMIT 3;',
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b3',
    title: 'Average Session Length',
    slug: 'average-session-length',
    difficulty: 'basic',
    section: 'basics',
    concept: 'Aggregate Functions',
    order: 3,
    prompt: 'Return the average minutes_played across all sessions, rounded to 2 decimal places, aliased as avg_minutes.',
    setup: '__SESSIONS__',
    solution: 'SELECT ROUND(AVG(minutes_played),2) AS avg_minutes FROM sessions;',
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b4',
    title: 'Total Minutes per App',
    slug: 'total-minutes-per-app',
    difficulty: 'basic',
    section: 'basics',
    concept: 'GROUP BY',
    order: 4,
    prompt: 'For each app_name (ignore sessions with a missing app name), return total minutes played as total_minutes. Order by total_minutes descending.',
    setup: '__SESSIONS__',
    solution: 'SELECT app_name, SUM(minutes_played) AS total_minutes FROM sessions WHERE app_name IS NOT NULL GROUP BY app_name ORDER BY total_minutes DESC;',
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b5',
    title: 'Frequently Used Apps',
    slug: 'frequently-used-apps',
    difficulty: 'basic',
    section: 'basics',
    concept: 'HAVING',
    order: 5,
    prompt: 'Find app_name(s) that appear in more than 4 sessions (ignore missing app names). Return app_name and session_count.',
    setup: '__SESSIONS__',
    solution: 'SELECT app_name, COUNT(*) AS session_count FROM sessions WHERE app_name IS NOT NULL GROUP BY app_name HAVING COUNT(*) > 4;',
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b6',
    title: 'Unique BeatWave Listeners',
    slug: 'unique-beatwave-listeners',
    difficulty: 'basic',
    section: 'basics',
    concept: 'DISTINCT',
    order: 6,
    prompt: "List the distinct user_id values for sessions on the app 'BeatWave', ordered ascending.",
    setup: '__SESSIONS__',
    solution: "SELECT DISTINCT user_id FROM sessions WHERE app_name='BeatWave' ORDER BY user_id;",
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b7',
    title: 'Session Length Category',
    slug: 'session-length-category',
    difficulty: 'basic',
    section: 'basics',
    concept: 'CASE WHEN',
    order: 7,
    prompt: "For every session, return session_id, minutes_played, and a length_category column: 'Short' if under 15 minutes, 'Medium' if 15-45 minutes (inclusive), otherwise 'Long'. Order by session_id.",
    setup: '__SESSIONS__',
    solution: "SELECT session_id, minutes_played, CASE WHEN minutes_played<15 THEN 'Short' WHEN minutes_played<=45 THEN 'Medium' ELSE 'Long' END AS length_category FROM sessions ORDER BY session_id;",
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b8',
    title: 'Filling In Missing App Names',
    slug: 'filling-missing-app-names',
    difficulty: 'basic',
    section: 'basics',
    concept: 'NULL Handling',
    order: 8,
    prompt: "Return session_id and app_name for every session, replacing any missing (NULL) app_name with 'Unknown'. Order by session_id.",
    setup: '__SESSIONS__',
    solution: "SELECT session_id, COALESCE(app_name,'Unknown') AS app_name FROM sessions ORDER BY session_id;",
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b9',
    title: 'Extracting Email Domains',
    slug: 'extracting-email-domains',
    difficulty: 'basic',
    section: 'basics',
    concept: 'String Functions',
    order: 9,
    prompt: "Return user_id, name, and the email domain (everything after '@') as domain, ordered by user_id.",
    setup: '__USERS__',
    solution: "SELECT user_id, name, SUBSTR(email, INSTR(email,'@')+1) AS domain FROM users ORDER BY user_id;",
    orderMatters: true,
    schemaNote: 'users(user_id, name, email)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-b10',
    title: 'June Session Count',
    slug: 'june-session-count',
    difficulty: 'basic',
    section: 'basics',
    concept: 'Date Functions',
    order: 10,
    prompt: "Return the total number of sessions that occurred in June 2026, aliased as session_count.",
    setup: '__SESSIONS__',
    solution: "SELECT COUNT(*) AS session_count FROM sessions WHERE strftime('%Y-%m', session_date) = '2026-06';",
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },

  // ==========================================
  // INTERMEDIATE
  // ==========================================
  {
    id: 'sql-i1',
    title: 'Sessions With Listener Names',
    slug: 'sessions-with-listener-names',
    difficulty: 'intermediate',
    section: 'intermediate',
    concept: 'INNER JOIN',
    order: 1,
    prompt: "Return session_id, the user's name, app_name, and minutes_played for sessions longer than 40 minutes. Order by minutes_played descending.",
    setup: '__SESSIONS__\n__USERS_FULL__',
    solution: 'SELECT s.session_id, u.name, s.app_name, s.minutes_played FROM sessions s JOIN users u ON s.user_id=u.user_id WHERE s.minutes_played>40 ORDER BY s.minutes_played DESC;',
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)\nusers(user_id, name, email)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-i2',
    title: 'Users Who Never Streamed',
    slug: 'users-who-never-streamed',
    difficulty: 'intermediate',
    section: 'intermediate',
    concept: 'LEFT JOIN / Anti-Join',
    order: 2,
    prompt: 'Return user_id and name for every user who has zero sessions logged.',
    setup: '__SESSIONS__\n__USERS_FULL__',
    solution: 'SELECT u.user_id, u.name FROM users u LEFT JOIN sessions s ON u.user_id=s.user_id WHERE s.session_id IS NULL;',
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)\nusers(user_id, name, email)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-i3',
    title: 'Above-Average Total Listeners',
    slug: 'above-average-total-listeners',
    difficulty: 'intermediate',
    section: 'intermediate',
    concept: 'Subqueries',
    order: 3,
    prompt: 'Find users whose total minutes played (summed across all their sessions) is greater than the average total-per-user across all users who have sessions. Return user_id and total_minutes, ordered by total_minutes descending.',
    setup: '__SESSIONS__',
    solution: 'SELECT user_id, SUM(minutes_played) AS total_minutes FROM sessions GROUP BY user_id HAVING SUM(minutes_played) > (SELECT AVG(total) FROM (SELECT SUM(minutes_played) AS total FROM sessions GROUP BY user_id)) ORDER BY total_minutes DESC;',
    orderMatters: true,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-i4',
    title: 'Employee-Manager Pairs',
    slug: 'employee-manager-pairs',
    difficulty: 'intermediate',
    section: 'intermediate',
    concept: 'Self-Join',
    order: 4,
    prompt: "For every employee who has a manager, return the employee's name and their manager's name. Order by employee's emp_id.",
    setup: `
      CREATE TABLE employees(emp_id INTEGER, name TEXT, manager_id INTEGER);
      INSERT INTO employees VALUES
      (1,'Meera',NULL),
      (2,'Arjun',1),
      (3,'Priya',1),
      (4,'Rohan',2),
      (5,'Tara',2),
      (6,'Vikram',3);
    `,
    solution: 'SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON e.manager_id=m.emp_id ORDER BY e.emp_id;',
    orderMatters: true,
    schemaNote: 'employees(emp_id, name, manager_id)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-i5',
    title: 'Order Values Across Tables',
    slug: 'order-values-across-tables',
    difficulty: 'intermediate',
    section: 'intermediate',
    concept: 'Multiple JOINs',
    order: 5,
    prompt: 'For each order, return the customer name, product_name, and total_value (price × quantity). Order by total_value descending.',
    setup: `
      CREATE TABLE customers(customer_id INTEGER, name TEXT);
      INSERT INTO customers VALUES (1,'Anaya'),(2,'Dev'),(3,'Sana');
      CREATE TABLE products(product_id INTEGER, product_name TEXT, price INTEGER);
      INSERT INTO products VALUES (1,'Wireless Mouse',799),(2,'Mechanical Keyboard',2999),(3,'USB-C Hub',1499);
      CREATE TABLE orders(order_id INTEGER, customer_id INTEGER, product_id INTEGER, quantity INTEGER);
      INSERT INTO orders VALUES (1,1,1,2),(2,2,2,1),(3,1,3,1),(4,3,1,3),(5,2,3,2);
    `,
    solution: 'SELECT c.name AS customer, p.product_name, (p.price*o.quantity) AS total_value FROM orders o JOIN customers c ON o.customer_id=c.customer_id JOIN products p ON o.product_id=p.product_id ORDER BY total_value DESC;',
    orderMatters: true,
    schemaNote: 'customers(customer_id, name)\nproducts(product_id, product_name, price)\norders(order_id, customer_id, product_id, quantity)',
    starterCode: '-- Write your SQLite query below\n'
  },

  // ==========================================
  // ADVANCED
  // ==========================================
  {
    id: 'sql-a1',
    title: 'Runner-Up Salary Per Department',
    slug: 'runner-up-salary-per-department',
    difficulty: 'advanced',
    section: 'advanced',
    concept: 'Window Functions — RANK',
    order: 1,
    prompt: 'Find the second-highest distinct salary within each department. Return dept and salary, ordered by dept.',
    setup: `
      CREATE TABLE emp_salaries(emp_id INTEGER, name TEXT, dept TEXT, salary INTEGER);
      INSERT INTO emp_salaries VALUES
      (1,'Meera','Engineering',95000),
      (2,'Arjun','Engineering',88000),
      (3,'Priya','Engineering',88000),
      (4,'Rohan','Sales',72000),
      (5,'Tara','Sales',68000),
      (6,'Vikram','Marketing',60000);
    `,
    solution: 'WITH ranked AS (SELECT dept, salary, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk FROM emp_salaries) SELECT DISTINCT dept, salary FROM ranked WHERE rnk=2 ORDER BY dept;',
    orderMatters: true,
    schemaNote: 'emp_salaries(emp_id, name, dept, salary)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-a2',
    title: 'Cumulative Daily Revenue',
    slug: 'cumulative-daily-revenue',
    difficulty: 'advanced',
    section: 'advanced',
    concept: 'Window Functions — Running Total',
    order: 2,
    prompt: 'Return order_date, amount, and a running_total of amount ordered chronologically by order_date.',
    setup: `
      CREATE TABLE daily_orders(order_date TEXT, amount INTEGER);
      INSERT INTO daily_orders VALUES
      ('2026-06-01',500),
      ('2026-06-02',300),
      ('2026-06-03',450),
      ('2026-06-04',200),
      ('2026-06-05',600);
    `,
    solution: 'SELECT order_date, amount, SUM(amount) OVER (ORDER BY order_date) AS running_total FROM daily_orders ORDER BY order_date;',
    orderMatters: true,
    schemaNote: 'daily_orders(order_date, amount)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-a3',
    title: 'Frequent June Listeners (via CTE)',
    slug: 'frequent-june-listeners-via-cte',
    difficulty: 'advanced',
    section: 'advanced',
    concept: 'CTEs',
    order: 3,
    prompt: 'Using a CTE, find users with more than 2 sessions in June 2026. Return user_id and cnt (session count).',
    setup: '__SESSIONS__',
    solution: "WITH june_sessions AS (SELECT user_id, COUNT(*) AS cnt FROM sessions WHERE strftime('%Y-%m',session_date)='2026-06' GROUP BY user_id) SELECT user_id, cnt FROM june_sessions WHERE cnt>2;",
    orderMatters: false,
    schemaNote: 'sessions(session_id, user_id, app_name, minutes_played, session_date)',
    starterCode: '-- Write your SQLite query below\n'
  },
  {
    id: 'sql-a4',
    title: 'Above-Category-Average Priced Products',
    slug: 'above-category-average-priced-products',
    difficulty: 'advanced',
    section: 'advanced',
    concept: 'Correlated Subquery',
    order: 4,
    prompt: 'Find products priced above the average price within their own category. Return id, category, and price, ordered by id.',
    setup: `
      CREATE TABLE cat_products(id INTEGER, category TEXT, price INTEGER);
      INSERT INTO cat_products VALUES
      (1,'Audio',799),
      (2,'Audio',1999),
      (3,'Accessories',299),
      (4,'Accessories',1499),
      (5,'Storage',2499),
      (6,'Storage',999);
    `,
    solution: 'SELECT p.id, p.category, p.price FROM cat_products p WHERE p.price > (SELECT AVG(price) FROM cat_products p2 WHERE p2.category=p.category) ORDER BY p.id;',
    orderMatters: true,
    schemaNote: 'cat_products(id, category, price)',
    starterCode: '-- Write your SQLite query below\n'
  }
];
