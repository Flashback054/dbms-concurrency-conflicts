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
			-- Kiểm tra @MaThuoc tồn tại
			IF NOT EXISTS(SELECT * FROM Thuoc WHERE MaThuoc=@MaThuoc)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không tồn tại'
				RAISERROR(@ERROR_MESSAGE, 16,1)
			END

			-- Kiểm tra SoLuongTon > @SLMua
			IF NOT EXISTS (SELECT * 
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon >= @SLMua)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE, 16,1)
			END

			-- Kiểm tra thuốc chưa hết hạn
			IF NOT EXISTS (SELECT * 
					FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.NgayHetHan > GETDATE())
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' đã hết hạn'
				RAISERROR(@ERROR_MESSAGE, 16,1)
			END

			WAITFOR DELAY '0:0:05'
			---------

			-- Đọc thông tin thuốc
			SELECT * FROM Thuoc WHERE Thuoc.MaThuoc = @MaThuoc AND Thuoc.SoLuongTon > @SLMua
			-- Nếu không tìm được thuốc thì báo lỗi
			IF (@@ROWCOUNT = 0)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MaThuoc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không đủ số lượng tồn'
				RAISERROR(@ERROR_MESSAGE,16,1)
			END

		END TRY
		BEGIN CATCH
			SET @ERROR_MESSAGE = ERROR_MESSAGE()
			PRINT @ERROR_MESSAGE
			ROLLBACK TRAN
			RAISERROR(@ERROR_MESSAGE, 16,1)
			RETURN
		END CATCH
	COMMIT TRAN
END
GO

-- Quan tri vien cap nhat so luong ton cua thuoc
CREATE OR ALTER
PROC sp_CapNhatSoLuongTonThuoc
	@MaThuoc INT,
	@SoLuongTon INT
AS
BEGIN
	DECLARE @ERROR_MESSAGE NVARCHAR(200)

	BEGIN TRAN
		BEGIN TRY
			-- Kiểm tra @MaThuoc tồn tại
			IF NOT EXISTS(SELECT * FROM Thuoc WHERE MaThuoc=@MaThuoc)
			BEGIN
				SET @ERROR_MESSAGE = N'Thuốc với MãThuốc ' + CAST(@MaThuoc AS VARCHAR(10)) + N' không tồn tại'
				RAISERROR(@ERROR_MESSAGE, 16,1)
			END

			-- Kiểm tra @SoLuongTon được nhập vào không âm
			IF (@SoLuongTon<0)
			BEGIN
				SET @ERROR_MESSAGE = N'Số lượng tồn cập nhật không được âm'
				RAISERROR(@ERROR_MESSAGE, 16,1)
			END

			-- Tiến hành cập nhật SoLuongTon
			UPDATE Thuoc
			SET SoLuongTon = @SoLuongTon
			WHERE Thuoc.MaThuoc = @MaThuoc

		END TRY
		BEGIN CATCH
			PRINT ERROR_MESSAGE()
			ROLLBACK TRAN
			RETURN
		END CATCH
	COMMIT TRAN
END