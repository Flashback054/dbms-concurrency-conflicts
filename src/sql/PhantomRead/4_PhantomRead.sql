-- INSERT A NEW INSTANCE INTO "Thuoc" TABLE
CREATE OR ALTER
PROCEDURE sp_InsertThuocInstance
    @TenThuoc NVARCHAR(255),
	@DonViTinh NVARCHAR(50),
	@DonGia FLOAT,
	@ChiDinh NVARCHAR(MAX),
	@SoLuongTon INT,
	@NgayHetHan DATE
AS
-- RETURNS <Insert items count>
BEGIN TRAN
	BEGIN TRY
		IF EXISTS (SELECT * FROM Thuoc WHERE TenThuoc = @TenThuoc)
		BEGIN
			PRINT '"Thuoc" with "Name" ' + CAST(@TenThuoc AS NVARCHAR(255)) + ' already exists in the table.';
			ROLLBACK TRAN
			RETURN 0
		END

		INSERT INTO Thuoc (TenThuoc, DonViTinh, DonGia, ChiDinh, SoLuongTon, NgayHetHan)
		VALUES (@TenThuoc, @DonViTinh, @DonGia, @ChiDinh, @SoLuongTon, @NgayHetHan);

		PRINT '"Thuoc" with "Name" ' + CAST(@TenThuoc AS NVARCHAR(10)) + ' has been in the table.';
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMsg VARCHAR(2000)
		SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
		ROLLBACK TRAN
		RETURN 0
	END CATCH
COMMIT TRAN
RETURN 1
GO


-- GET STOCK AMOUNT STATISTICS (No instances, No Expired instances, No OOS instances)
CREATE OR ALTER
PROC sp_GetStockSatistics
	@NoInstances INT OUT,
	@NoExpiredInstances INT OUT,
	@NoOOSInstances INT OUT
AS
SET TRAN ISOLATION LEVEL REPEATABLE READ
BEGIN TRAN
	BEGIN TRY
		(SELECT @NoInstances = COUNT(*) FROM Thuoc)

		(SELECT @NoExpiredInstances = COUNT(*)
			FROM Thuoc
			WHERE NgayHetHan < GETDATE())

		---------------------------------
		WAITFOR DELAY '0:0:2'
		---------------------------------

		(SELECT @NoOOSInstances = COUNT(*)
			 FROM Thuoc
			 WHERE SoLuongTon <= 0)
	END TRY

	BEGIN CATCH
		DECLARE @ErrorMsg VARCHAR(2000)
		SELECT @ErrorMsg = 'ERROR: ' + ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16,1)
		ROLLBACK TRAN
		RETURN 1
	END CATCH
COMMIT TRAN
RETURN 0
GO