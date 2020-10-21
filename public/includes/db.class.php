<?


// Custom Result Set       

// ������� ����� ������� �������
class CCustomResultSet 
{
  var $FStorage;                // private - ������ �������

  var $isFirst 	= false;	// private - ���� ��������� �� ������ ������
  var $isLast	= false;	// private - ���� ��������� �� ��������� ������

  function CCustomResultSet()
  {
    $this->FStorage = array();   // ������������� ������� - ��� ����� �� ����� �������� array_push
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

  // �������� ���� � ������
  function Add($AField)
  {
    array_push($this->FStorage, $AField);
  }

  // ���������� ����� � ������
  function Count()
  {
    return count($this->FStorage); 
  }

  // ����������������� �� ������ ���� (������ ������������� ����)
  function First()
  {
    $this->isFirst = true;
    // return reset($this->FStorage);
  }

  // ������� ��������� ������, ���� ���������� ���� ������� ���� - �� ������� �������, ��� �������� ���������
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

  // ����������������� �� ��������� ���� � ������� ������
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

  // ����������������� �� ������� ���� � ������� ������
  function Current()
  {
    return Current($this->FStorage);
  }

  // ����������������� �� ���������� ���� � ������� ������
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
  // ������� ���������� ���� �� ����� (���������� ��� �������� �������������)
  function GetValue($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent->GetValue();
    };

    return FALSE;
  }

  // ������� ����� ���� ������� �� �����
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

// ���� ������ ������ - ������� ������ �����
class CField
{
  var $name;                    // private - ��� ���� (��. GetName)        
  var $value;			// private - ���������� ���� (��. GetValue)

  function CField($name, $value = '')
  {
    $this->name = $name;
    $this->value= $value;
  }

  function GetName()	{	return $this->name;	}   
  function GetValue()	{	return $this->value;	}
};

// ����� ����� ��� ������� � �������� ������
class CRecord extends CCustomResultSet
{
  // ������� ����� ���� ������� �� �����
  function GetField($name)
  {
    foreach ($this->FStorage as $fieldCurrent)
    {
      if ($fieldCurrent->getName()==$name)
      	return $fieldCurrent;
    };
  }

  // ������� ���������� ���� �� ����� (���������� ��� �������� �������������)
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