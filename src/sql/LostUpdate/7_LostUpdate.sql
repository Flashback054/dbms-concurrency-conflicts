CREATE OR ALTER
PROCEDURE [dbo].[sp_UpdateSoluongtonThuoc_Before]
    @MaThuoc INT,
    @SoThuoc INT
AS
BEGIN TRANSACTION
        BEGIN TRY
            IF NOT EXISTS (SELECT 1 FROM Thuoc WHERE MaThuoc = @MaThuoc)
            BEGIN
                RAISERROR('MaThuoc is not exists', 16, 1)
            END

			DECLARE @SoLuongton INT;
			SET @SoLuongton = ( SELECT SoLuongTon FROM Thuoc WHERE MaThuoc = @MaThuoc) + @SoThuoc

			IF @SoLuongton < 0
            BEGIN
                RAISERROR('New SoluongTon must be greater than 0.', 16, 1)
            END

			WAITFOR DELAY '0:0:6'

            UPDATE Thuoc
            SET SoLuongTon = @SoLuongton
            WHERE MaThuoc = @MaThuoc   
        END TRY

        BEGIN CATCH
            DECLARE @ErrorMsg VARCHAR(2000)
			SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
			RAISERROR(@ErrorMsg, 16,1)
            ROLLBACK TRANSACTION
        END CATCH
COMMIT TRANSACTION
GO

CREATE OR ALTER
PROCEDURE [dbo].[sp_UpdateSoluongtonThuoc_After]
    @MaThuoc INT,
    @SoThuoc INT
AS
BEGIN TRANSACTION
        BEGIN TRY
            IF NOT EXISTS (SELECT 1 FROM Thuoc WHERE MaThuoc = @MaThuoc)
            BEGIN
                RAISERROR('MaThuoc is not exists', 16, 1)
            END

			DECLARE @SoLuongton INT;
			SET @SoLuongton = ( SELECT SoLuongTon FROM Thuoc WHERE MaThuoc = @MaThuoc) + @SoThuoc

			IF @SoLuongton < 0
            BEGIN
                RAISERROR('New SoluongTon must be greater than 0.', 16, 1)
            END

            UPDATE Thuoc
            SET SoLuongTon = @SoLuongton
            WHERE MaThuoc = @MaThuoc
            END TRY
            
        BEGIN CATCH
            DECLARE @ErrorMsg VARCHAR(2000)
			SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
			RAISERROR(@ErrorMsg, 16,1)
            ROLLBACK TRANSACTION
        END CATCH
COMMIT TRANSACTION
GO