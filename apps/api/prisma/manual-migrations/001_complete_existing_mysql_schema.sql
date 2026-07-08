-- Ejecutar en la base existente jpxdcegu_app_tecnicos.
-- Compatible con MariaDB/DBeaver antiguo: no usa DELIMITER, procedimientos ni ADD COLUMN IF NOT EXISTS.
-- Se puede ejecutar mas de una vez; las columnas e indices se crean solo si faltan.

SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `tb_usuarios` ADD COLUMN `role` ENUM('superadmin', 'admin', 'supervisor', 'technician') NOT NULL DEFAULT 'technician'", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tb_usuarios' AND COLUMN_NAME = 'role');
EXECUTE IMMEDIATE @sql;

SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `tb_usuarios` ADD COLUMN `active` TINYINT(1) NOT NULL DEFAULT 1", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tb_usuarios' AND COLUMN_NAME = 'active');
EXECUTE IMMEDIATE @sql;

CREATE TABLE IF NOT EXISTS order_statuses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  color VARCHAR(30) NOT NULL,
  icon VARCHAR(80) NOT NULL,
  priority INT NOT NULL DEFAULT 99,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY order_statuses_name_unique (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO order_statuses (name, color, icon, priority)
VALUES
  ('En curso', '#2563eb', 'Wrench', 1),
  ('Falta de piezas', '#d97706', 'PackageSearch', 2),
  ('Finalizado', '#16a34a', 'CheckCircle2', 50),
  ('Cancelado', '#dc2626', 'CircleX', 90),
  ('Pendiente', '#111827', 'Clock3', 99)
ON DUPLICATE KEY UPDATE
  color = VALUES(color),
  icon = VALUES(icon),
  priority = VALUES(priority);

SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `order_status_id` BIGINT UNSIGNED NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'order_status_id');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `customer_name` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'customer_name');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `customer_id_card` VARCHAR(120) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'customer_id_card');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `postal_code` VARCHAR(40) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'postal_code');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `cross_streets` TEXT NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'cross_streets');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `neighborhood` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'neighborhood');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `home_phone` VARCHAR(80) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'home_phone');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `cell_phone` VARCHAR(80) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'cell_phone');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `office_phone` VARCHAR(80) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'office_phone');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `phone_extension` VARCHAR(40) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'phone_extension');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `assigned_to_type` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'assigned_to_type');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `purchase_place_origin` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'purchase_place_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `technician_number` VARCHAR(120) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'technician_number');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `model_origin` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'model_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `module_origin` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'module_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `serial_number_origin` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'serial_number_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `base_origin` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'base_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `product_description_origin` TEXT NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'product_description_origin');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_purchase_place` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_purchase_place');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_invoice_number` VARCHAR(120) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_invoice_number');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_purchase_date` DATE NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_purchase_date');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_brand` VARCHAR(120) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_brand');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_model` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_model');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `confirmed_serial_number` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'confirmed_serial_number');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `requires_invoice` TINYINT(1) NOT NULL DEFAULT 0", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'requires_invoice');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `part_number` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'part_number');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `description_1` TEXT NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'description_1');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `description_2` TEXT NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'description_2');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `description_3` TEXT NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'description_3');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `kilometers_traveled` DECIMAL(10,2) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'kilometers_traveled');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `location_place` VARCHAR(255) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'location_place');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `public_token` VARCHAR(120) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'public_token');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `client_signature_path` VARCHAR(500) NULL", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'client_signature_path');
EXECUTE IMMEDIATE @sql;
SET @sql = (SELECT IF(COUNT(*) = 0, "ALTER TABLE `ordenes` ADD COLUMN `is_completed` TINYINT(1) NOT NULL DEFAULT 0", "SELECT 1") FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND COLUMN_NAME = 'is_completed');
EXECUTE IMMEDIATE @sql;

UPDATE ordenes
SET order_status_id = (SELECT id FROM order_statuses WHERE name = 'Pendiente' LIMIT 1)
WHERE order_status_id IS NULL;

SET @sql = (SELECT IF(COUNT(*) = 0, "CREATE INDEX `ordenes_order_status_id_idx` ON `ordenes` (`order_status_id`)", "SELECT 1") FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND INDEX_NAME = 'ordenes_order_status_id_idx');
EXECUTE IMMEDIATE @sql;

SET @sql = (SELECT IF(COUNT(*) = 0, "CREATE UNIQUE INDEX `ordenes_public_token_unique` ON `ordenes` (`public_token`)", "SELECT 1") FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ordenes' AND INDEX_NAME = 'ordenes_public_token_unique');
EXECUTE IMMEDIATE @sql;

CREATE TABLE IF NOT EXISTS order_photos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  photo_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NULL,
  mime_type VARCHAR(80) NOT NULL,
  size INT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY order_photos_order_id_idx (order_id),
  CONSTRAINT order_photos_order_id_fk FOREIGN KEY (order_id) REFERENCES ordenes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS supervisor_links (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  token VARCHAR(120) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_by_user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY supervisor_links_token_unique (token),
  KEY supervisor_links_created_by_user_id_idx (created_by_user_id),
  CONSTRAINT supervisor_links_created_by_user_id_fk FOREIGN KEY (created_by_user_id) REFERENCES tb_usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pdf_imports (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  extracted_text LONGTEXT NULL,
  extracted_payload JSON NULL,
  status ENUM('pending_review', 'confirmed', 'failed') NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY pdf_imports_user_id_idx (user_id),
  CONSTRAINT pdf_imports_user_id_fk FOREIGN KEY (user_id) REFERENCES tb_usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


