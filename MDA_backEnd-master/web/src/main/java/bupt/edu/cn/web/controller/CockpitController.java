package bupt.edu.cn.web.controller;

import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.Cockpit;
import bupt.edu.cn.web.pojo.Diagram;
import bupt.edu.cn.web.repository.CockpitRepository;
import bupt.edu.cn.web.repository.DiagramRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * graphIds 记录图表的id列表
 */
@RestController
public class CockpitController {

//    @Autowired
//    DashboardRepository dashboardRepository;

    @Autowired
    CockpitRepository cockpitRepository;
    @Autowired
    DiagramRepository diagramRepository;

    @RequestMapping(value = "/saveCockpit", method = RequestMethod.POST)
    public ReturnModel saveCockpit(String cockpitId, String diagramIDs, String name, String userId, String info, String layoutConf, Boolean realtime, String tableDashboard,
                                   HttpServletResponse response, HttpServletRequest request){
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------saveCockpit-----------");
        System.out.println("cockpitId = " + cockpitId);
        System.out.println("diagramsIDs = " + diagramIDs);
        System.out.println("name = " + name);
        System.out.println("info = " + info);
        System.out.println("userId = " + userId);
        ReturnModel result = new ReturnModel();
        Cockpit cockpit = new Cockpit();
        if (cockpitId == "" || cockpit.equals("")){        //传空的时候为0，为增加一个Cockpit
            cockpit.setUserId(userId);
        }else {
            try {
//                cockpit = cockpitRepository.findById(Integer.valueOf(cockpitId));
                cockpit = cockpitRepository.findById(Integer.valueOf(cockpitId)).orElse(null);
                System.out.println(cockpit);
            }catch (Exception e){
                result.setResult(false);
                result.setReason(e.toString());
                return result;
            }
        }
        cockpit.setName(name);
        cockpit.setDiagramIDs(diagramIDs);
        cockpit.setInfo(info);
        cockpit.setLayoutConf(layoutConf);
//        cockpit.setRealtime(realtime);
        cockpit.setRealtime(1);
        cockpit.setTableDashboard(tableDashboard);
        // 暂时将两个id设为1，后续需更改
        cockpit.setProjectId(1);
        cockpit.setWorkId(1);
        System.out.println(cockpit.getId());
        cockpitRepository.saveAndFlush(cockpit);
        result.setResult(true);
        return result;
    }

    @RequestMapping("/getCockpitByUserId")
    public ReturnModel getCockpitByUserId(String userId, HttpServletRequest request, HttpServletResponse response){
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------getCockpitByUserId-----------");
        System.out.println("userId = " + userId);
        ReturnModel result = new ReturnModel();
        try {
            result.setDatum(cockpitRepository.findAllByUserId(userId));
            result.setResult(true);
        }catch (Exception e){
            result.setResult(false);
            result.setReason(e.toString());
        }
        System.out.println(result.getDatum());
        return result;
    }

    @RequestMapping("/deleteCockpitById")
    public ReturnModel deleteCockpitById(int cockpitId, HttpServletResponse response, HttpServletRequest request) {
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        ReturnModel result = new ReturnModel();
        try {
            cockpitRepository.deleteById(cockpitId);
            result.setResult(true);
        }catch (Exception e){
            result.setResult(false);
            result.setReason(e.toString());
        }
        return result;
    }

    @RequestMapping("/setCockpitRealTime")
    public ReturnModel setCockpitRealTime(int cockpitId, boolean isRealTime, HttpServletResponse response, HttpServletRequest request){
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        ReturnModel result = new ReturnModel();
        try {
            cockpitRepository.updataRealTime(isRealTime, cockpitId);
            result.setResult(true);
        }catch (Exception e){
            result.setResult(false);
            result.setReason(e.toString());
        }
        return result;
    }

    @RequestMapping("/getCockpitById")
    public ReturnModel getCockpitById(int cockpitId, HttpServletResponse response, HttpServletRequest request){
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        ReturnModel result = new ReturnModel();
        Cockpit cockpit = new Cockpit();
        try {
            cockpit = cockpitRepository.findById(cockpitId);
            result.setResult(true);
        }catch (Exception e){
            result.setResult(false);
            result.setReason(e.toString());
        }
        Map converCockpit = new HashMap();
        converCockpit.put("id", cockpit.getId());
        converCockpit.put("layoutconf", cockpit.getLayoutConf());
        converCockpit.put("tabledashboard", cockpit.getTableDashboard());
        converCockpit.put("diagramids", cockpit.getDiagramIDs());
        converCockpit.put("name", cockpit.getName());
        converCockpit.put("info", cockpit.getInfo());
        System.out.println(converCockpit);
        result.setDatum(converCockpit);
        return result;
    }

//    --------------------------------------------------------------------

//    @RequestMapping("/saveDashboard")
//    public ReturnModel saveDashboard(String dashboardId,String graphs, String userId, String name, HttpServletResponse response, HttpServletRequest request) {
//        // 解决Ajax跨域请求问题
//        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        System.out.println("----------saveDashboard-----------");
//        System.out.println("dashboardId = "+dashboardId);
//        System.out.println("graphs = "+graphs);
//        System.out.println("userId = "+userId);
//        System.out.println("name = "+name);
//        ReturnModel result = new ReturnModel();
//        //根据id查找Dashboard
//        //java8 Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。
//        Optional<Dashboard> dashboard;
//        try{
//            dashboard = dashboardRepository.findById(Long.valueOf(dashboardId));
//        }catch (Exception e){
//            result.setResult(false);
//            result.setReason("saveDashboard 出错！");
//            return result;
//        }
//        //判断是否存在，新增/更新
//        Dashboard newDashboard;
//        if (dashboard.isPresent()){
//            newDashboard = dashboard.get();
//        }else {
//            newDashboard = new Dashboard();
//        }
//        //赋值
//        newDashboard.setId(Long.valueOf(dashboardId));
//        newDashboard.setGraphIds(graphs);
//        newDashboard.setUserId(userId);
//        newDashboard.setName(name);
//        dashboardRepository.saveAndFlush(newDashboard);
//        //返回结果
//        result.setResult(true);
//        return result;
//    }
//
//    @RequestMapping("/getALLDashboard")
//    public ReturnModel getALLDashboard(HttpServletResponse response, HttpServletRequest request) {
//        // 解决Ajax跨域请求问题
//        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        //返回所有Dashboard
//        ReturnModel result = new ReturnModel();
//        result.setResult(true);
//        result.setDatum(dashboardRepository.findAll());
//        return result;
//    }
//
//    @RequestMapping("/getDashboardById")
//    public ReturnModel getDashboardById(String id, HttpServletResponse response, HttpServletRequest request) {
//        // 解决Ajax跨域请求问题
//        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        //返回该Dashboard
//        ReturnModel result = new ReturnModel();
//        try
//        {
//            result.setDatum(dashboardRepository.findById(Long.valueOf(id)).get());
//            result.setResult(true);
//        }catch (Exception e){
//            System.out.println("错误："+e.toString());
//            result.setResult(false);
//            result.setReason("getDashboardById 出错！");
//        }
//        return result;
//    }
//
//    @RequestMapping("/getDashboardByUserId")
//    public ReturnModel getDashboardByUserId(String userId, HttpServletResponse response, HttpServletRequest request) {
//        // 解决Ajax跨域请求问题
//        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        System.out.println("----------getDashboardByUserId-----------");
//        System.out.println("userId = "+userId);
//        //返回该用户的所有Dashboard
//        ReturnModel result = new ReturnModel();
//        try
//        {
//            result.setDatum(dashboardRepository.findByUserId(userId));
//            result.setResult(true);
//        }catch (Exception e){
//            System.out.println("错误："+e.toString());
//            result.setResult(false);
//            result.setReason("getDashboardByUserId 出错！");
//        }
//        return result;
//    }
//    @RequestMapping("/deleteDashboardById")
//    public ReturnModel deleteDashboardById(String id, HttpServletResponse response, HttpServletRequest request) {
//        // 解决Ajax跨域请求问题
//        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
//        response.setHeader("Access-Control-Allow-Credentials", "true");
//        //返回该Dashboard
//        ReturnModel result = new ReturnModel();
//        try {
//            dashboardRepository.deleteById(Long.valueOf(id));
//            result.setResult(true);
//        }catch (Exception e){
//            System.out.println("错误："+e.toString());
//            result.setResult(false);
//            result.setReason("Dashboard 删除出错！");
//        }
//        return result;
//    }

}
