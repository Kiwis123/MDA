package bupt.edu.cn.web.controller;

import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.Project;
import bupt.edu.cn.web.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.Map;


/**
 * @description:
 * @author: tc
 * @create: 2020/03/10 15:49
 */

@RestController
public class ProjectController {
    @Autowired
    ProjectRepository projectRepository;

    /**
     * 获取项目列表
     * @return
     */
    @RequestMapping(value = "/getProjectList", method = RequestMethod.GET)
    public ReturnModel getProjectList(){
        ReturnModel result = new ReturnModel();
        result.setDatum(projectRepository.findAll());

        return result;
    }

    /**
     * 根据id更新项目名称&描述
     * @return
     */
    @RequestMapping(value = "/updateProject", method = RequestMethod.PUT)
    public ReturnModel updateProject(@RequestParam Map param){
        ReturnModel result = new ReturnModel();
        Project project = projectRepository.findById(Integer.valueOf(param.get("id").toString())).orElse(null);
        project.setName(param.get("name").toString());
        project.setDescription(param.get("description").toString());
        System.out.println(project);
        try {
            projectRepository.saveAndFlush(project);
            result.setResult(true);
        }catch (Exception e){
            System.out.println(e);
            result.setResult(false);
        }
        return result;
    }

    /**
     * 根据id删除项目
     * @return
     */
    @RequestMapping(value = "/deleteProject", method = RequestMethod.DELETE)
    public ReturnModel deleteProject(@RequestParam int id){
        ReturnModel result = new ReturnModel();
        System.out.println(id);
        try {
            projectRepository.deleteById(id);
            result.setResult(true);
        }catch (Exception e){
            System.out.println(e);
            result.setResult(false);
        }
        return result;
    }

    /**
     * 新增项目
     * @return
     */
    @RequestMapping(value = "/addProject", method = RequestMethod.POST)
    public ReturnModel addProject(@RequestParam Map param){
        ReturnModel result = new ReturnModel();
        Project project = new Project();
        project.setName(param.get("name").toString());
        project.setDescription(param.get("description").toString());
        project.setUser(param.get("user").toString());
        project.setCreateTime(new Date(System.currentTimeMillis()));
        System.out.println(project);
        try {
            projectRepository.saveAndFlush(project);
            result.setResult(true);
        }catch (Exception e){
            System.out.println(e);
            result.setResult(false);
        }
        return result;
    }

}
