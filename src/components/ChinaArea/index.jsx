import {Select} from 'antd';
import {useState, useEffect, useCallback} from 'react';
import styles from './index.less';
import {getProvinces, getCities, getAreas} from '@/services/global';

const {Option} = Select

/**
 * 地区选择组件--返回省市区ID
 * @param props
 * @returns {
      provinceId:province,
      cityId:city,
      areaId:area
    }
 * @constructor
 */
const ChinaArea = (props) => {
  // console.log(props)
  const {onChange, value, disabled} = props
  const [province, setProvince] = useState(null);
  const [provinceList, setProvinceList] = useState([]);
  const [city, setCity] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [area, setArea] = useState(null);
  const [areaList, setAreaList] = useState([]);

  // 获取省份
  const getProvinceList = useCallback(
    async () => {
      try {
        const res = await getProvinces({size: 100, page: 1});
        // console.log(res)
        setProvinceList(res.data.data)
      } catch (e) {
        console.log(e)
      }
    }, []
  )

  // 获取市
  const getCitiesList = useCallback(
    async (id) => {
      try {
        const res = await getCities({size: 100, page: 1, provinceId: id});
        // console.log(res)
        setCityList(res.data.data)
      } catch (e) {
        console.log(e)
      }
    }
  )

  // 获取区
  const getAreaList = useCallback(
    async (id) => {
      try {
        const res = await getAreas({size: 100, page: 1, cityId: id});
        // console.log(res)
        setAreaList(res.data.data)
      } catch (e) {
        console.log(e)
      }
    }
  )

  function handleChange(v, type) {
    console.log(v)
    const values = v || null
    let obj = {
      provinceId: province,
      cityId: city,
      areaId: area
    }
    if (type === 'province') {
      obj = {provinceId: values, cityId: null, areaId: null}
      setProvince(values)
      setCity(null)
      setArea(null)
      setAreaList([])
      if (values) {
        getCitiesList(values)
      } else {
        setCityList([])
      }
    } else if (type === 'cities') {
      obj = {...obj, ...{cityId: values, areaId: null}}
      setCity(values)
      setArea(null)
      if (values) {
        getAreaList(values)
      } else {
        setAreaList([])
      }
    } else if (type === 'area') {
      obj = {...obj, ...{areaId: values}}
      setArea(values)
    }
    onChange(obj)
  }

  useEffect(() => {
    // console.log(value);
    if (value) {
      setProvince(value.provinceId)
      setCity(value.cityId)
      setArea(value.areaId)
      getCitiesList(value.provinceId)
      getAreaList(value.cityId)
    }
    getProvinceList();
  }, [getProvinceList]);

  return (
    <div className={styles.container}>
      <Select value={province} style={{width: 120}} placeholder="省" disabled={disabled === true} onChange={(v) => handleChange(v, 'province')}
              allowClear>
        {
          provinceList.map((item) => (
            <Option value={item.id} key={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select value={city} style={{width: 120}} placeholder="市" disabled={disabled === true} onChange={(v) => handleChange(v, 'cities')} allowClear>
        {
          cityList.map((item) => (
            <Option value={item.id} key={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select value={area} style={{width: 120}} placeholder="区" disabled={disabled === true} onChange={(v) => handleChange(v, 'area')} allowClear>
        {
          areaList.map((item) => (
            <Option value={item.id} key={item.id}>{item.name}</Option>
          ))
        }
      </Select>
    </div>
  )
}

export default ChinaArea;
