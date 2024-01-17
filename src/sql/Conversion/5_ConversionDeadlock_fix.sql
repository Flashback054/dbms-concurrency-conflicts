CREATE OR ALTER PROC USP_KHOATAIKHOAN
    @MaTaiKhoan INT
AS
BEGIN TRAN
    SET TRAN ISOLATION LEVEL READ COMMITTED
    BEGIN TRY
        IF  EXISTS (SELECT * FROM KhachHang WHERE MaKhachHang = @MaTaiKhoan)
            BEGIN
                WAITFOR DELAY '0:0:3'

                UPDATE KhachHang
                SET TrangThai = N'Đã khoá'
                WHERE MaKhachHang = @MaTaiKhoan
            END
        ELSE IF EXISTS (SELECT * FROM NhaSi WHERE MaNhaSi = @MaTaiKhoan)
            BEGIN
                WAITFOR DELAY '0:0:3'

                UPDATE NhaSi
                SET TrangThai = N'Đã khoá'
                WHERE MaNhaSi = @MaTaiKhoan
            END
        ELSE IF EXISTS (SELECT * FROM NhanVien WHERE MaNhanVien = @MaTaiKhoan)
            BEGIN
                WAITFOR DELAY '0:0:3'

                UPDATE NhanVien
                SET TrangThai = N'Đã khoá'
                WHERE MaNhanVien = @MaTaiKhoan
            END
        ELSE
            BEGIN
                RAISERROR(N'TÀI KHOẢN KHÔNG TỒN TẠI!', 16, 1)
            END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg NVARCHAR(2000)
		SELECT @ErrorMsg = ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16, 1)
    END CATCH
COMMIT TRAN
GO

CREATE OR ALTER PROC USP_CAPNHATTHONGTIN
    @MaKhachHang INT,
    @MatKhau nvarchar(20)
AS
BEGIN TRAN
    SET TRAN ISOLATION LEVEL REPEATABLE READ
    BEGIN TRY
        IF EXISTS (SELECT * FROM KhachHang WHERE MaKhachHang = @MaKhachHang AND (TrangThai <> N'Đã khoá' OR TrangThai IS NULL))
        BEGIN
            WAITFOR DELAY '0:0:3'

            UPDATE KhachHang
            SET MatKhau = @MatKhau
            WHERE MaKhachHang = @MaKhachHang
        END
        ELSE
            BEGIN
                RAISERROR(N'TÀI KHOẢN KHÔNG TỒN TẠI!', 16, 1)
            END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMsg NVARCHAR(2000)
		SELECT @ErrorMsg = ERROR_MESSAGE()
		RAISERROR(@ErrorMsg, 16, 1)
    END CATCH
COMMIT TRAN
RETURN 0
GO