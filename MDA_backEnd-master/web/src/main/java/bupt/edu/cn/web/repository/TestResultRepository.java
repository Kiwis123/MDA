package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TestResultRepository extends JpaRepository<TestResult, Integer>, JpaSpecificationExecutor<TestResult> {

}