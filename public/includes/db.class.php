<?


// Custom Result Set       

// Базовый класс наборов записей
class CCustomResultSet 
{
  var $FStorage;                // private - массив записей

  var $isFirst 	= false;	// private - флаг установки на первую запись
  var $isLast	= false;	// private - флаг установки на последнюю запись

  function CCustomResultSet()
  {
    $this->FStorage = array();   // инициализация массива - без этого не будет работать array_push
  }

  function GetAll()
  {
    return $this->FStorage;
  }

  function Unique()
  {
    return array_unique($this->FStorage);
  }

  function MakeUnique()
  {
    $this->FStorage = array_unique($this->FStorage);
  }

  // Добавить поле в запись
  function Add($AField)
  {
    array_push($this->FStorage, $AField);
  }

  // Количество полей в записи
  function Count()
  {
    return count($this->FStorage); 
  }

  // Позиционироваться на первое поле (просто устанавливает флаг)
  function First()
  {
    $this->isFirst = true;
    // return reset($this->FStorage);
  }

  // Вернуть следующий объект, если установлен флаг первого поля - то вернуть текущий, для верности отресетив
  function Next()
  {
    if ($this->isFirst) 
    {
      $this->isFirst = false;
      return reset($this->FStorage);
    }
    else
    {
      return next ($this->FStorage);
    };

  }

  // Позиционироваться на последнее поле и вернуть объект
  function Last()
  {
    if ($this->isLast) 
    {
      $this->isFirst = false;
      return end($this->FStorage);
    }
    else
    {
      return prev ($this->FStorage);
    };
  }

  // Позиционироваться на текущее поле и вернуть объект
  function Current()
  {
    return Current($this->FStorage);
  }

  // Позиционироваться на предыдущее поле и вернуть объект
  function Previous()
  {
    return prev	($this->FStorage);
  }

  function Reverse()
  {
    $this->FStorage = array_reverse($this->FStorage);
  }
}

class CResultSet extends CCustomResultSet 
{
}

class CParam
{
  var $name;
  var $value;

  function CParam($name, $value)
  {
    $this->name  = $name;
    $this->value = $value;
  }

  function GetName()	{ return $this->name;	}
  function GetValue()   { return $this->value;  }
}

class CParamSet extends CCustomResultSet
{
  // Вернуть содержимое поля по имени (надстройка для удобства использования)
  function GetValue($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent->GetValue();
    };

    return FALSE;
  }

  // Вернуть класс поля целиком по имени
  function GetField($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent;
    };

    return FALSE;
  }
}

// Поле набора данных - элемент набора полей
class CField
{
  var $name;                    // private - имя поля (см. GetName)        
  var $value;			// private - содержимое поля (см. GetValue)

  function CField($name, $value = '')
  {
    $this->name = $name;
    $this->value= $value;
  }

  function GetName()	{	return $this->name;	}   
  function GetValue()	{	return $this->value;	}
};

// Набор полей для общения с модулями данных
class CRecord extends CCustomResultSet
{
  // Вернуть класс поля целиком по имени
  function GetField($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent;
    };
  }

  // Вернуть содержимое поля по имени (надстройка для удобства использования)
  function GetValue($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent->GetValue();
    };
  }
}

?>