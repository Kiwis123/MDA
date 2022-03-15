package bupt.edu.cn.web.pojo;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Table(name = "cockpit")
@Data
@Entity
public class Cockpit implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id", nullable = false)
    private Integer projectId;

    @Column(name = "work_id", nullable = false)
    private Integer workId;

    @Column(name = "diagramIDs")
    private String diagramIDs;

    @Column(name = "layoutConf")
    private String layoutConf;

    @Column(name = "realtime")
    private Integer realtime = 0;

    @Column(name = "info")
    private String info;

    @Column(name = "tableDashboard")
    private String tableDashboard;

    @Column(name = "updatetime", nullable = false)
    private Timestamp updatetime;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "name")
    private String name;

    
}