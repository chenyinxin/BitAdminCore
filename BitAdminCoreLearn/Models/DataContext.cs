using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BitAdminCoreLearn.Models
{
    public partial class DataContext : DbContext
    {
        public virtual DbSet<SysUser> SysUser { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer(@"data source=.;initial catalog=BitAdminCore;user id=sa;password=123456;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SysUser>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId)
                    .HasColumnName("userId")
                    .ValueGeneratedNever();

                entity.Property(e => e.Birthday)
                    .HasColumnName("birthday")
                    .HasColumnType("datetime");

                entity.Property(e => e.CreateBy).HasColumnName("createBy");

                entity.Property(e => e.CreateTime)
                    .HasColumnName("createTime")
                    .HasColumnType("datetime");

                entity.Property(e => e.DepartmentId).HasColumnName("departmentId");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(128);

                entity.Property(e => e.ExtendId)
                    .HasColumnName("extendId")
                    .HasMaxLength(64);

                entity.Property(e => e.Gender)
                    .HasColumnName("gender")
                    .HasMaxLength(32);

                entity.Property(e => e.IdCard)
                    .HasColumnName("idCard")
                    .HasMaxLength(32);

                entity.Property(e => e.Mobile)
                    .HasColumnName("mobile")
                    .HasMaxLength(32);

                entity.Property(e => e.OrderNo).HasColumnName("orderNo");

                entity.Property(e => e.Post)
                    .HasColumnName("post")
                    .HasMaxLength(32);

                entity.Property(e => e.UpdateBy).HasColumnName("updateBy");

                entity.Property(e => e.UpdateTime)
                    .HasColumnName("updateTime")
                    .HasColumnType("datetime");

                entity.Property(e => e.UserCode)
                    .HasColumnName("userCode")
                    .HasMaxLength(32);

                entity.Property(e => e.UserName)
                    .HasColumnName("userName")
                    .HasMaxLength(32);

                entity.Property(e => e.UserPassword)
                    .HasColumnName("userPassword")
                    .HasMaxLength(128);

                entity.Property(e => e.UserStatus)
                    .HasColumnName("userStatus")
                    .HasMaxLength(32);
            });
        }
    }
}
