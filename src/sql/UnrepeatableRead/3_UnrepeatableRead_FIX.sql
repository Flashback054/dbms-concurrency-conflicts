CREATE OR ALTER
PROC sp_DocThongTinThuoc
	@MaThuoc INT,
	@SLMua INT
AS
BEGIN
	DECLARE @ERROR_MESSAGE NVARCHAR(200)

	SET TRAN ISOLATION LEVEL REPEATABLE READ
	BEGIN TRAN
		BEGIN TRY
			IF NOT EXISTS(SELECT * FROM Thuoc WHERE MaThuoc=@MaThuoc)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không tồn tại'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			IF NOT EXISTS (SELECT *
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon >= @SLMua)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			IF NOT EXISTS (SELECT *
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.NgayHetHan > GETDATE())
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' đã hết hạn'
				RAISERROR(@ERROR_MESSAGE, 16, 1)
			END

			WAITFOR DELAY '0:0:3'

			SELECT * FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon > @SLMua
			IF (@@ROWCOUNT = 0)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE,16, 1)
			END

		END TRY
		BEGIN CATCH
			SET @ERROR_MESSAGE = ERROR_MESSAGE()
			PRINT @ERROR_MESSAGE
			RAISERROR(@ERROR_MESSAGE, 16, 1)
			RETURN
		END CATCH
	COMMIT TRAN
END
GO