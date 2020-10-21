<?php
?>
<aside id="control-sidebar" class="control-sidebar control-sidebar-dark">
</aside>
<div class="control-sidebar-bg"></div>
<script type="text/javascript">
    var pagename='{{$pagename or ''}}';
    var dashboard_id=0;
    var controlbar_params = <?=isset($controlbar_params)?json_encode($controlbar_params):'\'\''?>;
</script>
<script type="text/javascript" src="/js/common/controlbar.js"></script>
<?php


