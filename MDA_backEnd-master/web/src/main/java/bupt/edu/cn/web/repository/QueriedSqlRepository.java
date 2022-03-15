package bupt.edu.cn.web.repository;

import bupt.edu.cn.web.pojo.Cockpit;
import bupt.edu.cn.web.pojo.QueriedSql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

public interface QueriedSqlRepository extends JpaRepository<QueriedSql, Integer>, JpaSpecificationExecutor<QueriedSql> {

    @Transactional
    @Query(value = "select count(1) from queried_sql where project_id=?1", nativeQuery = true)
    public BigInteger count(Integer projectId);

    @Transactional
    @Query(value = "select query_engine, count(1) as num from queried_sql where project_id=?1 group by query_engine", nativeQuery = true)
    public List countByQueryEngine(Integer projectId);

    @Transactional
    @Query(value = "select avg(query_latency) from queried_sql where project_id=?1 and time between date_add(now(), interval -30 day ) and now()", nativeQuery = true)
    public Double countLatencyLastMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(query_latency) from queried_sql where project_id=?1 and time between date_add(now(), interval -60 day ) and date_add(now(), interval -30 day )", nativeQuery = true)
    public Double countLatencyLastTwoMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(query_latency),month(time) from queried_sql group by month(time) limit 6", nativeQuery = true)
    public List countQueryLatencyMultipleMonth(Integer projectId);

    @Transactional
    @Query(value = "select avg(query_latency),query_engine from queried_sql group by query_engine", nativeQuery = true)
    public List countQueryLatencyByQueryEngine(Integer projectId);

}