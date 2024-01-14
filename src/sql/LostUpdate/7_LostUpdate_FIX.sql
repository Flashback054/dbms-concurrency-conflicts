-- THU NGÂN CẬP NHẬT SỐ LƯỢNG TỒN CỦA THUỐC
--CREATE
ALTER
PROCEDURE sp_UpdateSoluongtonThuoc_Before
    @MaThuoc INT,
    @SoThuoc INT
AS

BEGIN TRANSACTION
        BEGIN TRY
            -- Kiểm tra ID
            IF NOT EXISTS (SELECT 1 FROM Thuoc WHERE MaThuoc = @MaThuoc)
            BEGIN
               PRINT CAST(@MaThuoc AS VARCHAR(3)) + N' is not exists';
                ROLLBACK TRANSACTION;
                RETURN 0;
            END

			DECLARE @SoLuongton INT;
			SET @SoLuongton = ( SELECT SoLuongTon FROM Thuoc WITH (XLOCK) WHERE MaThuoc = @MaThuoc) + @SoThuoc;

		
            -- Kiểm tra số lượng tồn mới có nhỏ hơn 0
			IF @SoLuongton < 0
            BEGIN
                PRINT 'New SoluongTon must be greater than 0.';
                ROLLBACK TRANSACTION;
                RETURN 0;
            END

			-- Chờ để giao tác sau thi
			WAITFOR DELAY '0:0:6'


            -- Cập nhật số lượng tồn của thuốc
            UPDATE Thuoc
            SET SoLuongTon = @SoLuongton
            WHERE MaThuoc = @MaThuoc;

           
        END TRY
        BEGIN CATCH
            DECLARE @ErrorMsg VARCHAR(2000)
			SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
			RAISERROR(@ErrorMsg, 16,1)
            ROLLBACK TRANSACTION;
            RETURN 0;
        END CATCH
COMMIT TRANSACTION;
RETURN 1;
GO

-- QUẢN TRỊ VIÊN CẬP NHẬT SỐ LƯỢNG TỒN THUỐC
--CREATE
ALTER
PROCEDURE sp_UpdateSoluongtonThuoc_After
    @MaThuoc INT,
    @SoThuoc INT
AS

BEGIN TRANSACTION
        BEGIN TRY
            -- Kiểm tra ID 
            IF NOT EXISTS (SELECT 1 FROM Thuoc WHERE MaThuoc = @MaThuoc)
            BEGIN
               PRINT CAST(@MaThuoc AS VARCHAR(3)) + N' is not exists';
                ROLLBACK TRANSACTION;
                RETURN 0;
            END

			DECLARE @SoLuongton INT;
			SET @SoLuongton = ( SELECT SoLuongTon FROM Thuoc WITH (XLOCK) WHERE MaThuoc = @MaThuoc) + @SoThuoc;

		
            -- Kiểm tra số lượng tồn mới có nhỏ hơn 0
			IF @SoLuongton < 0
            BEGIN
                PRINT 'New SoluongTon must be greater than 0.';
                ROLLBACK TRANSACTION;
                RETURN 0;
            END

            -- Cập nhật số lượng tồn của thuốc
            UPDATE Thuoc
            SET SoLuongTon = @SoLuongton
            WHERE MaThuoc = @MaThuoc;

           
        END TRY
        BEGIN CATCH
            DECLARE @ErrorMsg VARCHAR(2000)
			SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
			RAISERROR(@ErrorMsg, 16,1)
            ROLLBACK TRANSACTION;
            RETURN 0;
        END CATCH
COMMIT TRANSACTION;
RETURN 1;
GO