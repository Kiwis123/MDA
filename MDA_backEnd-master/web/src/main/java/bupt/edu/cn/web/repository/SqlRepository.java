package bupt.edu.cn.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import bupt.edu.cn.web.pojo.Sql;

public interface SqlRepository extends JpaRepository<Sql, Integer>, JpaSpecificationExecutor<Sql> {

}